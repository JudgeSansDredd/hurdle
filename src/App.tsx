import { useEffect, useState } from "react";
import ProgressBar from "./components/ProgressBar";
import TileMap from "./components/TileMap";
import Layout from "./layouts";
import {
  getAttempts,
  getLetterPossibilities,
  getLocalStorage,
  getTiles,
  getWordIsPossible,
} from "./utils/functions";
import { useNextGuess } from "./utils/hooks";
import { Attempt } from "./utils/types";
import { possibleWordList } from "./utils/wordList";

export default function App() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      var tab = tabs[0];
      if (tab) {
        if (tab.url && tab.url.includes("nytimes.com/games/wordle")) {
          // We're on wordle
          const localStorage = await chrome.scripting.executeScript({
            target: { tabId: tab.id ?? 0, allFrames: true },
            func: getLocalStorage,
          });
          const tiles = await chrome.scripting.executeScript({
            target: { tabId: tab.id ?? 0, allFrames: true },
            func: getTiles,
          });

          setAttempts(
            getAttempts(localStorage[0].result ?? null, tiles[0].result ?? null)
          );
        }
      }
    });
  }, []);

  useEffect(() => {
    if (attempts.length === 0) {
      setPossibleWords([]);
    }
    setPossibleWords(
      possibleWordList
        .filter((word) =>
          getWordIsPossible(word, getLetterPossibilities(attempts) ?? [])
        )
        .slice(0, 10)
    );
  }, [attempts.length]);

  const { processing, nextGuesses, progress } = useNextGuess(attempts);
  nextGuesses.sort((a, b) => b.bits - a.bits);

  if (!attempts) {
    return (
      <Layout>
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          style={{ color: "white", textAlign: "center" }}
        >
          Go to Wordle!
        </a>
      </Layout>
    );
  }

  return (
    <Layout>
      <TileMap attempts={attempts} />
      {processing && (
        <div className="py-2">
          <ProgressBar percentage={progress ?? 0} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          {nextGuesses.length > 0 &&
            nextGuesses.slice(0, 10).map((guess, index) => {
              return (
                <div key={`guess-${index}`}>{`${guess.word.toUpperCase()}: ${
                  Math.round(guess.bits * 1000) / 1000
                }`}</div>
              );
            })}
        </div>
        <div>
          {possibleWords.length > 0 &&
            possibleWords.map((word, index) => {
              return <div key={`word-${index}`}>{word.toUpperCase()}</div>;
            })}
        </div>
      </div>
    </Layout>
  );
}
