const extensionId = "dddjppjkalecnpilaclkbogkoodkihbd";

function updateWordleState() {
  const strWordleState = localStorage.getItem("nyt-wordle-state");
  const wordleState = JSON.parse(strWordleState);
  chrome.storage.local.set({ wordleState });
}

// chrome.runtime.sendMessage(
//   extensionId,
//   {
//     /* whatever you want to send goes here */
//   },
//   (response) => {
//     /* handle the response from background here */
//   }
// );

window.addEventListener("storage", () => {
  console.log("storage changed!");
  updateWordleState();
});
updateWordleState();
