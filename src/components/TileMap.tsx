import { Attempt } from "../utils/types";
import Tile from "./Tile";

interface PropType {
  gameState: Attempt[];
}

export default function TileMap({ gameState }: PropType) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {gameState.flatMap((attempt, index) => {
        return attempt.guess.split("").map((letter, letterIndex) => {
          return (
            <Tile
              key={`${index}-${letterIndex}`}
              letter={letter}
              color={attempt.evaluation[letterIndex]}
            />
          );
        });
      })}
    </div>
  );
}
