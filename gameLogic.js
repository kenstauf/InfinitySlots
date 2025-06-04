// -----------------------------------------------------------------   
// CALCULATE MINIMUM BET
function calcMinBet(rowCount) {
  return baseMinBet + (rowCount - 1) * 10;
}

// -----------------------------------------------------------------

// RECALCULATE MINIMUM BET AND UPDATE
function recalculateMinBet() {
  gameState.minBet = calcMinBet(gameState.rowCount);
  if (gameState.bet < gameState.minBet) {
    gameState.bet = gameState.minBet;
    updateSpinButtonLabel();
  }
}

// -----------------------------------------------------------------

// OFFER WAGER SAVER
function offerWagerSaver() {
  // Guard: Block if player is not eligible
  if (gameState.lostWagerSaver) {
    showGameAlert("You are not eligible for a wager saver, earn more money to spin again!");
    return;
  }

  if (gameState.coins > 0 && gameState.coins < gameState.minBet && !gameState.isSpinning) {
    showGameConfirm(
      `Wager Saver! You only have ${gameState.coins} coins, but the minimum bet is ${gameState.minBet}.\n Do you want to use your remaining coins for one last spin?`,
      function yes() {
        gameState.isWagerSaver = true;
        gameState.coins = gameState.minBet; // give player extra coins for last spin
        gameState.bet = gameState.minBet;   // ensure the entire minBet will be deducted for this spin
        updateCoinDisplay();
        spin();
      },
      function no() {
        // No action needed; just closes the dialog
      }
    );
  }
}


// -----------------------------------------------------------------

// BUY ROW FUNCTION
function buyRow() {
  if (gameState.coins < gameState.rowCost) {
    showGameAlert("Not enough coins to buy a new row!");
    return;
  }

  gameState.coins -= gameState.rowCost;
  gameState.rowCount++;

  // UNLOCK NEW FRUIT every 3rd row if more fruits remain
  if ((gameState.rowCount - 1) % 3 === 0 && gameState.symbols.length < allFruits.length) {
    gameState.symbols.push(allFruits[gameState.symbols.length]);
  }

  // Increase costs
  gameState.rowCost = Math.ceil(gameState.rowCost + rowCostIncrease + (gameState.rowCount / 3));
  updateCoinDisplay();
  document.getElementById("buyRowBtn").textContent = `Buy Row (${gameState.rowCost} coins)`;

document.querySelectorAll('.reels').forEach(col => {
  col.style.setProperty('--rows', gameState.rowCount);

  // Find the stack inside this column
  let stack = col.querySelector('.reels-stack');
  if (!stack) {
    // If it doesn't exist, create it
    stack = document.createElement('div');
    stack.className = 'reels-stack';
    col.appendChild(stack);
  }
});

  updateStatsPanel();
  recalculateMinBet();
}

// -----------------------------------------------------------------
//WEIGHTING THE SLOTS WITH MOSTLY COMMON FRUITS

function buildWeightedFruitPool(totalSymbols) {
  // Filter current unlocked symbols by rarity
  const commons = gameState.symbols.filter(fruit => commonFruits.includes(fruit));
  const uncommons = gameState.symbols.filter(fruit => uncommonFruits.includes(fruit));
  const rares = gameState.symbols.filter(fruit => rareFruits.includes(fruit));
  const epics = gameState.symbols.filter(fruit => epicFruits.includes(fruit));
  const legendaries = gameState.symbols.filter(fruit => legendaryFruits.includes(fruit));
  
  // Tuning what percent each rarity should occupy
  let numCommon = Math.round(totalSymbols * 0.50);
  let numUncommon = Math.round(totalSymbols * 0.20);
  let numRare = Math.round(totalSymbols * 0.20);
  let numEpic = Math.round(totalSymbols * 0.10);
  let numLegendary = totalSymbols - (numCommon + numUncommon + numRare + numEpic); // Fill to total

  let pool = [];
  
  // Helper to add random fruits of a given rarity
  function addRandom(fruitArr, num) {
    for (let i = 0; i < num; i++) {
      if (fruitArr.length > 0) {
        pool.push(fruitArr[Math.floor(Math.random() * fruitArr.length)]);
      }
    }
  }
  
  addRandom(commons, numCommon);
  addRandom(uncommons, numUncommon);
  addRandom(rares, numRare);
  addRandom(epics, numEpic);
  addRandom(legendaries, numLegendary);

  return pool;
}


// -----------------------------------------------------------------

function validateSpin() {

  // If lostWagerSaver is true AND player doesn't have enough for minBet, block spinning
  if (gameState.lostWagerSaver && gameState.coins < gameState.minBet) {
    showGameAlert("You need to earn more money before you spin again!");
    return false;
  }
  if (gameState.isSpinning) return false;
  if (gameState.isWagerSaver) return true;

  if (gameState.coins < gameState.bet) {
    if (gameState.coins > 0 && gameState.coins < gameState.minBet) {
      offerWagerSaver();
    } else if (gameState.coins === 0) {
      showGameAlert("You need to earn more money before you spin again!");
    } else {
      showGameAlert("Not enough coins for this bet!");
    }
    return false;
  }
  return true;
}


//-----------------------------------------------------------------

//FILL REELS WITH ICONS FROM DATA ARRAY IN ORDER TO SCROLL THEM DOWNWARD

function fillRows() {
  for (let col = 0; col < columns; col++) {
    // Find the reel and its stack
    const reel = document.getElementById(`reel${col}`);
    if (!reel) continue; // If missing, skip (shouldn't happen if set up at page load)
    let stack = reel.querySelector('.reels-stack');
    if (!stack) continue;

    // Clear previous symbols
    stack.innerHTML = '';

    // Fill with all symbols from gameState.spinResult[col]
    for (let i = 0; i < gameState.spinResult[col].length; i++) {
      const span = document.createElement('span');
      span.className = 'symbol';
      span.textContent = gameState.spinResult[col][i];
      stack.appendChild(span);
    }

    // Set visible window height
    reel.style.setProperty('--rows', gameState.rowCount);
  }
}


//-----------------------------------------------------------------

//SPIN ANIMATION FUNCTION, CALLS CHECKWIN AFTER FINISHING
function doSpin() {
  const reelLength = gameState.spinResult[0].length;
  const symbolHeight = 62;
  const baseScrollDuration = 1200; // ms
  const stagger = 300;             // ms

  // Sound timing
  const minSoundInterval = 150;   // Minimum ms between ticks
  const startDelay = 150;         // Initial ms between ticks
  const endDelay = 500;          // Final ms between ticks
  const totalTicks = 9;         // Number of sound ticks, tweak as needed

  // Set all reels to starting position instantly
  for (let col = 0; col < columns; col++) {
    const stack = document.querySelector(`#reel${col} .reels-stack`);
    if (stack) {
      const maxOffset = (reelLength - gameState.rowCount) * symbolHeight;
      stack.style.transition = 'none';
      stack.style.transform = `translateY(${-maxOffset}px)`;
      stack.offsetHeight; // force reflow
    }
  }

  // Animate reels
  for (let col = 0; col < columns; col++) {
    const stack = document.querySelector(`#reel${col} .reels-stack`);
    if (stack) {
      const scrollDuration = baseScrollDuration + (col * stagger);
      stack.style.transition = `transform ${scrollDuration}ms cubic-bezier(.25,.8,.5,1)`;
      stack.style.transform = `translateY(0px)`;
    }
  }

  // SOUND & TICK LOOP
  let tick = 0;
function tickSoundLoop() {
  if (tick > totalTicks) return; // Stop when done

  playSlotSound(.1, .1);

  // Progress: 0 = start, 1 = end
  const progress = tick / totalTicks;
  // Ease out: delays get longer as spin progresses
  const delay = Math.max(
    startDelay + (endDelay - startDelay) * progress * progress,
    minSoundInterval
  );

  tick++;
  if (tick <= totalTicks) {
    setTimeout(tickSoundLoop, delay);
  } else {
    // After the FINAL tick, stop the audio after the last delay
    setTimeout(stopSlotSound, delay);
  }
}

  tickSoundLoop();

  // Wait for the last column to finish before running checkWin
  const totalDuration = baseScrollDuration + ((columns - 1) * stagger);
  setTimeout(() => {
    checkWin();
    gameState.isSpinning = false;
    gameState.lostWagerSaver = false;
  }, totalDuration + 100);
}


// -----------------------------------------------------------------

//CHECK PAYOUT FOR ANY GIVEN ROW

function calculateRowPayout(symbols, rowIndex) {
  gameState.perRowBet = gameState.bet / gameState.rowCount;
  // Count occurrences
  const counts = {};
  for (const sym of symbols) counts[sym] = (counts[sym] || 0) + 1;

  // Find the symbol with the most matches
  let maxCount = 0;
  let matchSymbol = null;
  for (const [sym, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      matchSymbol = sym;
    }
  }

  let payout = 0;
  let winType = null;
  let rarity = "common";
  if (uncommonFruits.includes(matchSymbol)) rarity = "uncommon";
  else if (rareFruits.includes(matchSymbol)) rarity = "rare";
  else if (epicFruits.includes(matchSymbol)) rarity = "epic";
  else if (legendaryFruits.includes(matchSymbol)) rarity = "legendary";

  // Highest to lowest: giga (5), mega (4), major (3), minor (2)
  if (maxCount === 5) {
    payout = Math.floor(gameState.perRowBet * gameState.gigaWin * (rarityMultipliers[rarity] || 1));
    winType = "Giga";
    gameState.currentSpinGigaWins++;
  } else if (maxCount === 4) {
    payout = Math.floor(gameState.perRowBet * gameState.megaWin * (rarityMultipliers[rarity] || 1));
    winType = "Mega";
    gameState.currentSpinMegaWins++;
  } else if (maxCount === 3) {
    payout = Math.floor(gameState.perRowBet * gameState.majorWin * (rarityMultipliers[rarity] || 1));
    winType = "Major";
    gameState.currentSpinMajorWins++;
  } else if (maxCount === 2) {
    payout = Math.floor(gameState.perRowBet * gameState.minorWin * (rarityMultipliers[rarity] || 1));
    winType = "Minor";
    gameState.currentSpinMinorWins++;
  }
  // No win (all different): payout remains 0

  if (winType) {
    console.log(`Row ${rowIndex + 1}: ${winType} win! ${matchSymbol} (${rarity}), payout: ${payout}`);
  }

  return payout;
}

// ---------------------------------------------------------------

// CHECK WIN COUNT FUNCTION

function checkWin() {
  let totalWin = 0;
  let visibleSymbols = [];

  // Extract the currently displayed symbols (top to bottom)
  for (let row = 0; row < gameState.rowCount; row++) {
    visibleSymbols[row] = [];
    for (let col = 0; col < columns; col++) {
      visibleSymbols[row][col] = gameState.spinResult[col][row];
    }
  }

  // Loop through each row and calculate payouts
  for (let row = 0; row < gameState.rowCount; row++) {
    const rowSymbols = visibleSymbols[row];
    console.log(`Row ${row + 1}:`, rowSymbols);
    let rowPayout = calculateRowPayout(rowSymbols, row);
    totalWin += rowPayout;
  }

  // Handle payout
  if (gameState.isWagerSaver) {
    if (totalWin > gameState.minBet) {
      gameState.coins += totalWin;
      gameState.totalWinnings += totalWin;
      updateStatsPanel();
      updateCoinDisplay();

      // Show user total winnings, as well as major and minor win count
      let resultMsg = `
        Minor Wins: ${gameState.currentSpinMinorWins}<br>
        Major Wins: ${gameState.currentSpinMajorWins}<br>
        Mega Wins: ${gameState.currentSpinMegaWins}<br>
        Giga Wins: ${gameState.currentSpinGigaWins}<br>
        You won ${totalWin} coins!`;
      showGameAlert(resultMsg.trim());

      gameState.isWagerSaver = false;
      gameState.lostWagerSaver = false;

    } else {
      showGameAlert("You didn't win enough on your Wager Saver spin, go earn some more money!");
      gameState.isWagerSaver = false;
      gameState.lostWagerSaver = true;
    }
  } else {
    if (totalWin > 0) {
      gameState.coins += totalWin;
      gameState.totalWinnings += totalWin;
      updateStatsPanel();
      updateCoinDisplay();
      // Show user total winnings, as well as major and minor win count
      let resultMsg = `
        Minor Wins: ${gameState.currentSpinMinorWins}<br>
        Major Wins: ${gameState.currentSpinMajorWins}<br>
        Mega Wins: ${gameState.currentSpinMegaWins}<br>
        Giga Wins: ${gameState.currentSpinGigaWins}<br>
        You won ${totalWin} coins!`;
      showGameAlert(resultMsg.trim());
      gameState.lostWagerSaver = false;
    }
  }
  saveGame();
  console.log("Saved game!")
}




// -----------------------------------------------------------------
// SPIN FUNCTION
function spin() {
  // Constants
  const rowAnimationRows = Math.floor(gameState.rowCount / 3) + 30;
  const reelLength = gameState.rowCount + rowAnimationRows;

  //CLEAR ALERT BOX, SHOW SPIN IN PROGRESS TEXT
  showSpinInProgress();

  //VALIDATE SPIN
  if (!validateSpin()) return;
  

  //DEDUCT COINS
  gameState.coins -= gameState.bet;
  updateCoinDisplay();
  gameState.isSpinning = true;
  gameState.currentSpinMinorWins = 0;
  gameState.currentSpinMajorWins = 0;
  gameState.currentSpinMegaWins = 0;
  gameState.currentSpinGigaWins = 0;

  // Build a weighted pool of fruits, using your helper function
  const fruitPool = buildWeightedFruitPool(reelLength);

  // Create the spin result array (columns x reelLength)
  // This will look like: gameState.spinResult[col][pos]
  gameState.spinResult = [];
  for (let col = 0; col < columns; col++) {
    gameState.spinResult[col] = [];
    for (let pos = 0; pos < reelLength; pos++) {
      // Pick a random fruit from the weighted pool
      gameState.spinResult[col][pos] = fruitPool[Math.floor(Math.random() * fruitPool.length)];
    }
  }

  fillRows();
  doSpin();
}

// -----------------------------------------------------------------
