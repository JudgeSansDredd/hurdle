import { colors } from "../utils/resultTypes";

interface PropType {
  letter: string;
  color: colors;
}

export default function Tile(props: PropType) {
  const colorClass =
    props.color === "green"
      ? "bg-wordle-green"
      : props.color === "yellow"
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
