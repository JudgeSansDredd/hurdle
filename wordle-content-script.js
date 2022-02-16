let boardDiv = document.getElementById("board");

document.addEventListener("click", () => {
  chrome.storage.sync.get(["nyt-wordle-state"], function (result) {
    alert("Number of keys is " + Object.keys(result).length);
  });
  chrome.storage.sync.set({ foo: "bar" });
});
