//save logic here
function saveGame() {
  const saveData = {
    coins: coins,
    rowCount: rowCount,
    totalWinnings: totalWinnings,
    rowCost: rowCost
  };
  localStorage.setItem("slotSaveData", JSON.stringify(saveData));
}
//----------------------
//load logic here
function loadGame() {
  const save = JSON.parse(localStorage.getItem("slotSaveData"));
  if (save) {
    coins = save.coins;
    rowCount = save.rowCount;
    totalWinnings = save.totalWinnings;
    rowCost = save.rowCost;

    updateStatsPanel();
    initReels();
  }
}
