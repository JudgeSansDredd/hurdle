import { Attempt } from "../utils/types";
import Tile from "./Tile";

interface PropType {
  attempts: Attempt[];
}

export default function TileMap({ attempts }: PropType) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {attempts.flatMap((attempt, index) => {
        return attempt.map((letterEvaluation, letterEvaluationIndex) => {
          return (
            <Tile
              key={`${index}-${letterEvaluationIndex}`}
              letter={letterEvaluation.letter}
              evaluation={letterEvaluation.evaluation}
            />
          );
        });
      })}
    </div>
  );
}
