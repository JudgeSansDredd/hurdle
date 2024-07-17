import Layout from "./layouts";

export default function App() {
  return (
    <Layout>
      <div id="grid" className="grid grid-cols-2">
        <div>Possible remaining:</div>
        <div id="possible">-----</div>
        <div>Suggested Guess:</div>
        <div id="guess">-----</div>
      </div>
    </Layout>
  );
}
