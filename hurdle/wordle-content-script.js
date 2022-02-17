function updateWordleState() {
  const strWordleState = localStorage.getItem("nyt-wordle-state");
  const wordleState = JSON.parse(strWordleState);
  // chrome.runtime.sendMessage({ wordleState }, function (response) {
  //   console.log(response.updateMessage);
  // });
  // chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
  //   console.log(response.farewell);
  // });
}

window.addEventListener("storage", updateWordleState);
updateWordleState();
