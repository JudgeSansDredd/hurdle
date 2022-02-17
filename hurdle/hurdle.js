let possibleDiv = document.getElementById("possible");
let guessDiv = document.getElementById("guess");

// chrome.storage.local.get("wordleState", ({ wordleState: state }) => {
//   possibleDiv.innerHTML = JSON.stringify(state.boardState);
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.wordleState) {
//     possibleDiv.innerHTML = JSON.stringify(request.wordleState.boardState);
//     sendResponse({ updateMessage: "Hurdle updated" });
//   }
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
});
