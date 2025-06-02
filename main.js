// main.js
window.onload = function() {
  // Initialize UI
  updateCoinDisplay();
  initReels();
  updateSpinButtonLabel();
  updateStatsPanel();
  console.log("Version 0.00019")
  // Event listeners
  document.getElementById("spinButton").onclick = spin;
  document.getElementById("buyRowBtn").onclick = buyRow;
  document.getElementById("infoBox")?.addEventListener("click", toggleInfo);

  if (document.getElementById("increaseBetBtn"))
    document.getElementById("increaseBetBtn").onclick = increaseBet;
  if (document.getElementById("decreaseBetBtn"))
    document.getElementById("decreaseBetBtn").onclick = decreaseBet;
};

