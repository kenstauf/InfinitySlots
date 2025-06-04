    // UPDATING STATS PANEL
    function updateStatsPanel() {
      document.getElementById("statRows").textContent = gameState.rowCount;
      document.getElementById("statWinnings").textContent = gameState.totalWinnings;
      document.getElementById("unlockedFruits").innerHTML = gameState.symbols.join(' ');
    }

// ------------------------------------------------------

    // SET COINS AND UPDATE COINS
    function updateCoinDisplay() {
      document.getElementById("coinCount").textContent = gameState.coins;
    }

// ------------------------------------------------------

    // ADJUSTING THE BET
    function updateSpinButtonLabel() {
      document.getElementById("spinButton").textContent = `Spin (Bet: ${gameState.bet})`;
    }

// ------------------------------------------------------

// INITIALIZE REEL COLUMNS ON PAGE LOAD
function initReels() {
  const container = document.getElementById("reelContainer");
  container.innerHTML = ""; // Clear anything existing

  for (let col = 0; col < columns; col++) {
    const reel = document.createElement("div");
    reel.className = "reels";
    reel.id = `reel${col}`;

    const stack = document.createElement("div");
    stack.className = "reels-stack";

    // Fill with initial "❓" symbols for each rowCount
    for (let row = 0; row < gameState.rowCount; row++) {
      const span = document.createElement("span");
      span.className = "symbol";
      span.textContent = "❓";
      stack.appendChild(span);
    }

    reel.appendChild(stack);
    container.appendChild(reel);
    // Set CSS variable for initial row count
    reel.style.setProperty('--rows', gameState.rowCount);
  }
}



// ------------------------------------------------------

    // How to Win button
    function toggleInfo() {
      const infoBox = document.getElementById("infoBox");
      infoBox.style.display = infoBox.style.display === "none" ? "block" : "none";
    }

// ------------------------------------------------------

function increaseBet(amount = 1) {
  // If not enough coins for minBet, force bet to minBet and do nothing else
  if (gameState.coins < gameState.minBet) {
    gameState.bet = gameState.minBet;
  } else {
    gameState.bet = Math.min(Math.max(gameState.bet + amount, gameState.minBet), gameState.coins);
  }
  updateSpinButtonLabel();
}

function decreaseBet(amount = 1) {
  // If not enough coins for minBet, force bet to minBet and do nothing else
  if (gameState.coins < gameState.minBet) {
    gameState.bet = gameState.minBet;
  } else {
    gameState.bet = Math.min(Math.max(gameState.bet - amount, gameState.minBet), gameState.coins);
  }
  updateSpinButtonLabel();
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
//---------------------------------
//AUDIO FUNCTION

function playSlotSound(volume = 0.5, pitch = 1.0, clipDuration = 0.25) {
  const audio = document.getElementById("slotSound");
  audio.volume = volume;
  audio.playbackRate = pitch;
  audio.currentTime = 0.2; // Skip the first 0.2 seconds (optional)
  audio.play();
}


function stopSlotSound() {
  const audio = document.getElementById("slotSound");
  audio.pause();
  audio.currentTime = 0.2; // Or whatever start offset you prefer (e.g. 0.2)
}



