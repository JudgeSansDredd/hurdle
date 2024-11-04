import { useEffect, useState } from "react";
import Layout from "./layouts";
import { getGameState } from "./utils/functions";
import { GameStateType } from "./utils/types";

export default function App() {
  const [gameState, setGameState] = useState<GameStateType | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      var tab = tabs[0];
      if (tab) {
        if (tab.url && tab.url.includes("nytimes.com/games/wordle")) {
          // We're on wordle
          const injectionResults = await chrome.scripting.executeScript({
            target: { tabId: tab.id ?? 0, allFrames: true },
            func: getGameState,
          });
          setGameState(injectionResults[0].result ?? null);
        }
      }
    });
  }, []);

  if (!gameState) {
    return (
      <a
        href="https://www.nytimes.com/games/wordle/index.html"
        target="_blank"
        style={{ color: "white", textAlign: "center" }}
      >
        Go to Wordle!
      </a>
    );
  }

  return (
    <Layout>
      <div>{JSON.stringify(gameState)}</div>
      <div id="grid" className="grid grid-cols-2">
        <div>Possible remaining:</div>
        <div id="possible">-----</div>
        <div>Suggested Guess:</div>
        <div id="guess">-----</div>
      </div>
    </Layout>
  );
}
