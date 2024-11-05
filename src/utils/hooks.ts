import { useEffect, useState } from "react";
import { getWordIsPossible, nextGuessGenerator } from "./functions";
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
    const possibleWords = possibleWordList.filter((word) =>
      getWordIsPossible(word, attempts)
    );
    console.log("🚀 ~ useEffect ~ possibleWords:", possibleWords);
    const generator = nextGuessGenerator(attempts, possibleWords);
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
