import { useEffect, useState } from "react";
import { getNextGuess } from "./functions";
import { Attempt, BitCalculated } from "./types";

export const useNextGuess = (attempts: Attempt[]) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [nextGuesses, setNextGuesses] = useState<BitCalculated[]>([]);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (processing) return;
    setProcessing(true);
    setNextGuesses([]);
    const newNextGuesses = getNextGuess(attempts);
    setNextGuesses(newNextGuesses);
    setProcessing(false);
    setProgress(null);
  }, []);

  return { processing, nextGuesses, progress };
};
