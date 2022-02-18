const wordList = require("wordList");
const possibleDiv = document.getElementById("possible");
const guessDiv = document.getElementById("guess");
const button = document.getElementById("button");

button.addEventListener("click", () => {
  chrome.storage.local.get("wordleState", ({ wordleState: state }) => {
    const { boardState, evaluations } = state;
    // Calculate possible
    // Calculate next guess
  });
});
