import { GameStateType } from "./types";

export const getGameState = () => {
  const gameStateRaw = localStorage.getItem("games-state-wordleV2/ANON");
  const gameState: GameStateType | null = gameStateRaw
    ? JSON.parse(gameStateRaw)
    : null;
  return gameState;
};
