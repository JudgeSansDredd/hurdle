import { useEffect, useState } from "react";
import TileMap from "./components/TileMap";
import Layout from "./layouts";
import { getGameState, getLocalStorage, getTiles } from "./utils/functions";
import { Attempt } from "./utils/types";

export default function App() {
  const [gameState, setGameState] = useState<Attempt[]>([]);
  useEffect(() => {
    console.log("useEffect");
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

          setGameState(
            getGameState(
              localStorage[0].result ?? null,
              tiles[0].result ?? null
            )
          );
        }
      }
    });
  }, []);

  if (!gameState) {
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
      <TileMap gameState={gameState} />
    </Layout>
  );
}
