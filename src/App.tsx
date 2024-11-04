import Layout from "./layouts";
import { getGameState } from "./utils/functions";

export default function App() {
  const gameState = getGameState();

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
