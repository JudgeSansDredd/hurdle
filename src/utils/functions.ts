import { Attempt, LocalStorageType } from "./types";

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

export const getGameState = (
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
      return {
        guess,
        evaluation: tilesForGuess.map((tile) => {
          const { state } = tile;
          if (state === "correct") return "green";
          if (state === "present") return "yellow";
          if (state === "absent") return "gray";
          return "gray";
        }),
      };
    });
};
