    // UPDATING STATS PANEL
    function updateStatsPanel() {
      document.getElementById("statRows").textContent = rowCount;
      document.getElementById("statWinnings").textContent = totalWinnings;
      document.getElementById("unlockedFruits").innerHTML = symbols.join(' ');
    }

// ------------------------------------------------------

    // SET COINS AND UPDATE COINS
    function updateCoinDisplay() {
      document.getElementById("coinCount").textContent = coins;
    }

// ------------------------------------------------------

    // ADJUSTING THE BET
    function updateSpinButtonLabel() {
      document.getElementById("spinButton").textContent = `Spin (Bet: ${bet})`;
    }

// ------------------------------------------------------

// CREATE INITIAL ARRAY FOR ROWS
    function initRow() {
      const reelRow = document.createElement("div");
      reelRow.classList.add("reels");

      for (let i = 1; i <= 3; i++) {
        const span = document.createElement("span");
        span.id = `reel${i}1`; // FIRST ROW STARTS AT 1
        span.textContent = "❓";
        span.className = "symbol";
        reelRow.appendChild(span);
      }

      const container = document.getElementById("reelContainer");
      container.insertBefore(reelRow, container.firstChild);
    }


// ------------------------------------------------------

    // How to Win button
    function toggleInfo() {
      const infoBox = document.getElementById("infoBox");
      infoBox.style.display = infoBox.style.display === "none" ? "block" : "none";
    }

// ------------------------------------------------------

//INCREASE AND DECREASE BET
    function increaseBet() {
      if (bet < maxBet) {
        bet++;
        updateSpinButtonLabel();
      }
    }

    function decreaseBet() {
      if (bet > minBet) {
        bet--;
        updateSpinButtonLabel();
      }
    }

// ------------------------------------------------------

//SHOW IN GAME UI FOR MESSAGES

function showGameAlert(message) {
  const alertDiv = document.getElementById("gameAlert");
  const msgSpan = document.getElementById("gameAlertMsg");
  const btnDiv = document.getElementById("gameAlertButtons");
  msgSpan.innerHTML = message;       
  btnDiv.style.display = "none";
  alertDiv.style.display = "block";
}

// -------------------------------------

//SHOW IN GAME CONFIRM UI FOR WAGER SAVER

function showGameConfirm(message, yesCallback, noCallback) {
  const alertDiv = document.getElementById("gameAlert");
  const msgSpan = document.getElementById("gameAlertMsg");
  const btnDiv = document.getElementById("gameAlertButtons");
  const yesBtn = document.getElementById("gameAlertYesBtn");
  const noBtn = document.getElementById("gameAlertNoBtn");

  msgSpan.innerHTML = message;     
  btnDiv.style.display = "block";
  alertDiv.style.display = "block";

  yesBtn.onclick = null;
  noBtn.onclick = null;

  yesBtn.onclick = function() {
    alertDiv.style.display = "none";
    btnDiv.style.display = "none";
    if (yesCallback) yesCallback();
  };
  noBtn.onclick = function() {
    alertDiv.style.display = "none";
    btnDiv.style.display = "none";
    if (noCallback) noCallback();
  };
}

//----------------------------------------

// CHANGE ALERT BOX TO SHOW SPIN IN PROGRESS

function showSpinInProgress() {
  const alertDiv = document.getElementById("gameAlert");
  const msgSpan = document.getElementById("gameAlertMsg");
  const btnDiv = document.getElementById("gameAlertButtons");

  msgSpan.innerHTML = "Spin in progress...";
  btnDiv.style.display = "none";
  alertDiv.style.display = "block";
}


