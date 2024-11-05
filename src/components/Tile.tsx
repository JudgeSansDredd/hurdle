import { EvaluationType } from "../utils/types";

interface PropType {
  letter: string;
  evaluation: EvaluationType;
}

export default function Tile(props: PropType) {
  const colorClass =
    props.evaluation === "correct"
      ? "bg-wordle-green"
      : props.evaluation === "present"
      ? "bg-wordle-yellow"
      : "bg-wordle-gray";
  return (
    <div
      className={`${colorClass} text-white text-center p-4 text-2xl rounded-sm`}
    >
      {props.letter.toUpperCase()}
    </div>
  );
}
