function updateWordleState() {
  const strWordleState = localStorage.getItem("nyt-wordle-state");
  const wordleState = JSON.parse(strWordleState);
  chrome.storage.local.set({ wordleState });
}

window.addEventListener("storage", updateWordleState);
updateWordleState();
