import { useEffect, useState } from "react";
import { getLetterPossibilities, nextGuessGenerator } from "./functions";
import { Attempt, BitCalculated } from "./types";
import { possibleWordList } from "./wordList";

export const useNextGuess = (attempts: Attempt[]) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [nextGuesses, setNextGuesses] = useState<BitCalculated[]>([]);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    setProcessing(true);
    setProgress(0);
    setNextGuesses([]);
    const letterPossibilities = getLetterPossibilities(attempts);
    if (letterPossibilities === null) {
      setProcessing(false);
      setProgress(null);
      setNextGuesses([]);
      return;
    }
    const generator = nextGuessGenerator(attempts, possibleWordList);
    requestAnimationFrame(function runChunk() {
      const response = generator.next();
      if (!ignore) {
        setProgress(response.value.progress);
        setNextGuesses(response.value.results);
      }
      if (!response.done) {
        requestAnimationFrame(runChunk);
      } else {
        if (!ignore) {
          setProcessing(false);
          setProgress(null);
          setNextGuesses(response.value.results);
        }
      }
    });

    return () => {
      ignore = true;
    };
  }, [attempts.length]);

  return { processing, nextGuesses, progress };
};
