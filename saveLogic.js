//save logic here
function saveGame() {
  localStorage.setItem("slotSaveData", JSON.stringify(gameState));
}
//----------------------
//load logic here
function loadGame() {
  const save = JSON.parse(localStorage.getItem("slotSaveData"));
  if (save) {
    Object.assign(gameState, save);

    updateStatsPanel();
    initReels();
    document.getElementById("buyRowBtn").textContent = `Buy Row (${gameState.rowCost} coins)`;
  }
}
