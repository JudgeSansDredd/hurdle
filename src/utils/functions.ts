import {
  Attempt,
  EvaluationType,
  LetterPossibility,
  LocalStorageType,
} from "./types";
import { guessableWordList, possibleWordList } from "./wordList";

export const getLocalStorage = () => {
  const gameStateRaw = localStorage.getItem("games-state-wordleV2/ANON");
  const gameState: LocalStorageType | null = gameStateRaw
    ? JSON.parse(gameStateRaw)
    : null;
  return gameState;
};

export const getTiles = () => {
  const tiles = Array.from(
    document.querySelectorAll("[class^=Tile]")
  ) as HTMLElement[];
  return tiles.map((tile) => {
    return {
      letter: tile.innerHTML,
      state: tile.dataset.state as "present" | "absent" | "correct",
    };
  });
};

export const getAttempts = (
  localStorage: LocalStorageType | null,
  tiles: ReturnType<typeof getTiles> | null
): Attempt[] => {
  if (!localStorage || !tiles) return [];

  return localStorage.states[0].data.boardState
    .filter((guess) => guess.length > 0)
    .map((guess, index) => {
      const evaluationStartIndex = index * 5;
      const evaluationEndIndex = evaluationStartIndex + 4;
      const tilesForGuess = tiles.slice(
        evaluationStartIndex,
        evaluationEndIndex + 1
      );
      return guess.split("").map((letter, position) => ({
        letter,
        position,
        evaluation: tilesForGuess[position].state,
      }));
    });
};

const _getPossibleResults = (
  possibleResults?: EvaluationType[][]
): EvaluationType[][] => {
  const evaluationTypes: EvaluationType[] = ["present", "absent", "correct"];
  if (!possibleResults) {
    // Handle the first layer
    return _getPossibleResults(evaluationTypes.map((type) => [type]));
  }
  if (possibleResults[0].length === 5) {
    // Hnadle the last layer
    return possibleResults;
  }

  // Handle every other layer
  return _getPossibleResults(
    possibleResults.flatMap((possibleResult) =>
      evaluationTypes.map((type) => [...possibleResult, type])
    )
  );
};

export const getWordIsPossible = (
  word: string[],
  attempts: Attempt[]
): boolean => {
  const letterPossibilities = _getLetterPossibilities(attempts);
  return word.every((letter, position) => {
    const letterPossibility = letterPossibilities.find(
      (letterPossibility) => letterPossibility.letter === letter
    );
    if (!letterPossibility) return true;
    if (!letterPossibility.isPresent) return false;
    return letterPossibility.possiblePositions.includes(position);
  });
};

const _getLetterPossibilities = (attempts: Attempt[]): LetterPossibility[] => {
  const letterPossibilities: LetterPossibility[] = [];
  attempts.forEach((attempt) => {
    attempt.forEach((letterEvaluation) => {
      const letterPossibility = letterPossibilities.find(
        (letterPossibility) =>
          letterPossibility.letter === letterEvaluation.letter
      );
      if (!letterPossibility) {
        const newLetterPossibility: LetterPossibility = {
          letter: letterEvaluation.letter,
          isPresent:
            letterEvaluation.evaluation === "present" ||
            letterEvaluation.evaluation === "correct",
          possiblePositions:
            letterEvaluation.evaluation === "absent"
              ? []
              : letterEvaluation.evaluation === "correct"
              ? [letterEvaluation.position]
              : [0, 1, 2, 3, 4].filter(
                  (possiblePosition) =>
                    letterEvaluation.position !== possiblePosition
                ),
        };
        letterPossibilities.push(newLetterPossibility);
      } else {
        if (letterEvaluation.evaluation === "correct") {
          letterPossibility.isPresent = true;
          letterPossibility.possiblePositions = [letterEvaluation.position];
        } else if (letterEvaluation.evaluation === "present") {
          letterPossibility.isPresent = true;
          letterPossibility.possiblePositions =
            letterPossibility.possiblePositions.filter(
              (possiblePosition) =>
                possiblePosition !== letterEvaluation.position
            );
        }
      }
    });
  });
  return letterPossibilities;
};

export const calculateBits = (
  word: string[],
  attempts: Attempt[],
  possibleWords: string[]
) => {
  // Check if the word is even possible
  if (!getWordIsPossible(word, attempts)) return 0;
  // Calculate the bits
  const possibleResults = _getPossibleResults();
  return (
    possibleResults
      .map((possibleResult) => {
        const theoreticalAttempts = [
          ...attempts,
          word.map((letter, position) => ({
            letter,
            position,
            evaluation: possibleResult[position],
          })),
        ];
        const theoreticalPossibleWords = possibleWords.filter((word) =>
          getWordIsPossible(word.split(""), theoreticalAttempts)
        );

        const p =
          (possibleWords.length - theoreticalPossibleWords.length) /
          possibleWords.length;
        if (p === 0 || p === 1) return 0;
        return -1 * Math.log2(p);
      })
      .reduce((a, b) => a + b, 0) / possibleResults.length
  );
};

export function getNextGuess(attempts: Attempt[]) {
  const guessableWords = guessableWordList.filter((word) =>
    getWordIsPossible(word.split(""), attempts)
  );
  const possibleWords = possibleWordList.filter((word) =>
    getWordIsPossible(word.split(""), attempts)
  );
  const calculatedBits: { word: string; bits: number }[] = guessableWords
    .map((word) => {
      return {
        word,
        bits: calculateBits(word.split(""), attempts, possibleWords),
      };
    })
    .sort((a, b) => a.bits - b.bits);
  return calculatedBits.slice(0, 10);
}
