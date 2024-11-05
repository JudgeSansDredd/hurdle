import {
  Attempt,
  BitCalculated,
  EvaluationType,
  LetterPossibility,
  LocalStorageType,
} from "./types";

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

  const response = localStorage.states[0].data.boardState
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
  return response;
};

const _getPossiblePatterns = (
  possiblePatterns?: EvaluationType[][]
): EvaluationType[][] => {
  const evaluationTypes: EvaluationType[] = ["present", "absent", "correct"];
  if (!possiblePatterns) {
    // Handle the first layer
    return _getPossiblePatterns(evaluationTypes.map((type) => [type]));
  }
  if (possiblePatterns[0].length === 5) {
    // Hnadle the last layer
    return possiblePatterns;
  }

  // Handle every other layer
  return _getPossiblePatterns(
    possiblePatterns.flatMap((possibleResult) =>
      evaluationTypes.map((type) => [...possibleResult, type])
    )
  );
};

export const getWordIsPossible = (
  word: string,
  attempts: Attempt[]
): boolean => {
  const letterPossibilities = _getLetterPossibilities(attempts);

  return letterPossibilities.every((letterPossibility) => {
    // If letter is absent
    if (letterPossibility.possiblePositions.length === 0) {
      return !word.includes(letterPossibility.letter);
    }
    // If letter is correct
    if (letterPossibility.possiblePositions.length === 1) {
      return (
        word[letterPossibility.possiblePositions[0]] ===
        letterPossibility.letter
      );
    }
    // Letter is present
    // Check that the letter is present in the word
    if (!word.includes(letterPossibility.letter)) return false;
    // Check that the letter is not where we have found it is _not_ possible
    return [0, 1, 2, 3, 4]
      .filter((index) => !letterPossibility.possiblePositions.includes(index))
      .every(
        (cannotBeIndex) => word[cannotBeIndex] !== letterPossibility.letter
      );
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
        const { letter } = letterEvaluation;
        let possiblePositions: number[] = [];
        if (letterEvaluation.evaluation === "correct") {
          possiblePositions = [letterEvaluation.position];
        } else if (letterEvaluation.evaluation === "present") {
          possiblePositions = [0, 1, 2, 3, 4].filter(
            (possiblePosition) => possiblePosition !== letterEvaluation.position
          );
        } else {
          possiblePositions = [];
        }
        const newLetterPossibility: LetterPossibility = {
          letter,
          possiblePositions,
        };
        letterPossibilities.push(newLetterPossibility);
      } else {
        if (letterEvaluation.evaluation === "correct") {
          letterPossibility.possiblePositions = [letterEvaluation.position];
        } else if (letterEvaluation.evaluation === "present") {
          letterPossibility.possiblePositions =
            letterPossibility.possiblePositions.filter(
              (possiblePosition) =>
                possiblePosition !== letterEvaluation.position
            );
        } else {
          letterPossibility.possiblePositions = [];
        }
      }
    });
  });
  return letterPossibilities;
};

// export const calculateBits = (
//   word: string[],
//   attempts: Attempt[],
//   possibleWords: string[]
// ) => {
//   // Check if the word is even possible
//   if (!getWordIsPossible(word, attempts)) return 0;
//   // Calculate the bits
//   const possiblePatterns = _getPossiblePatterns();
//   return (
//     possiblePatterns
//       .map((possibleResult) => {
//         const theoreticalAttempts = [
//           ...attempts,
//           word.map((letter, position) => ({
//             letter,
//             position,
//             evaluation: possibleResult[position],
//           })),
//         ];
//         const theoreticalPossibleWords = possibleWords.filter((word) =>
//           getWordIsPossible(word.split(""), theoreticalAttempts)
//         );

//         const p =
//           (possibleWords.length - theoreticalPossibleWords.length) /
//           possibleWords.length;
//         if (p === 0 || p === 1) return 0;
//         return -1 * Math.log2(p);
//       })
//       .reduce((a, b) => a + b, 0) / possiblePatterns.length
//   );
// };

function* calculateBitsGenerator(
  word: string,
  attempts: Attempt[],
  possibleWords: string[]
) {
  const possiblePatterns = _getPossiblePatterns();
  const totalPatterns = possiblePatterns.length;
  let current = 0;
  for (let index = 0; index < possiblePatterns.length; index++) {
    const possibleResult = possiblePatterns[index];
    const theoreticalAttempts = [
      ...attempts,
      word.split("").map((letter, position) => {
        return {
          letter,
          position,
          evaluation: possibleResult[position],
        };
      }),
    ];
    const theoreticalPossibleWords = possibleWords.filter((word) =>
      getWordIsPossible(word, theoreticalAttempts)
    );
    const p =
      (possibleWords.length - theoreticalPossibleWords.length) /
      possibleWords.length;
    if (p !== 0 && p !== 1) {
      current += -1 * Math.log2(p);
    }
    yield current / totalPatterns;
  }
  return current / totalPatterns;
}

export function* nextGuessGenerator(
  attempts: Attempt[],
  possibleWords: string[]
) {
  const results: BitCalculated[] = [];
  for (let index = 0; index < possibleWords.length; index++) {
    const word = possibleWords[index];
    const generator = calculateBitsGenerator(word, attempts, possibleWords);
    let current = generator.next();
    while (!current.done) {
      current = generator.next();
      yield { results, progress: (100 * index) / possibleWords.length };
    }
    results.push({
      word,
      bits: current.value,
    });
    yield { results, progress: (100 * index) / possibleWords.length };
  }
  return { results, progress: 100 };
}
