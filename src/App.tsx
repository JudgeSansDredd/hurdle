import { useEffect, useState } from "react";
import ProgressBar from "./components/ProgressBar";
import TileMap from "./components/TileMap";
import Layout from "./layouts";
import { getAttempts, getLocalStorage, getTiles } from "./utils/functions";
import { useNextGuess } from "./utils/hooks";
import { Attempt } from "./utils/types";

export default function App() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
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

  const { processing, nextGuesses, progress } = useNextGuess(attempts);

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
      {processing && <ProgressBar percentage={progress ?? 0} />}
      {!processing &&
        nextGuesses.map((guess, index) => {
          return (
            <div key={`guess-${index}`}>{`${guess.word}: ${guess.bits}`}</div>
          );
        })}
    </Layout>
  );
}
