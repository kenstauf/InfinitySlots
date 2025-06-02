// -----------------------------------------------------------------   
// CALCULATE MINIMUM BET
function calcMinBet(rowCount) {
  return baseMinBet + (rowCount - 1) * 10;
}

// -----------------------------------------------------------------

    // RECALCULATE MINIMUM BET AND UPDATE
    function recalculateMinBet() {
      minBet = calcMinBet(rowCount);
      if (bet < minBet) {
        bet = minBet;
        updateSpinButtonLabel();
      }
    }

// -----------------------------------------------------------------

// OFFER WAGER SAVER
function offerWagerSaver() {
  // Guard: Block if player is not eligible
  if (lostWagerSaver) {
    showGameAlert("You are not eligible for a wager saver, earn more money to spin again!");
    return;
  }

  if (coins > 0 && coins < minBet && !isSpinning) {
    showGameConfirm(
      `Wager Saver! You only have ${coins} coins, but the minimum bet is ${minBet}.\n Do you want to use your remaining coins for one last spin?`,
      function yes() {
        isWagerSaver = true;
        coins = minBet; // give player extra coins for last spin
        bet = minBet;   // ensure the entire minBet will be deducted for this spin
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
  if (coins < rowCost) {
    showGameAlert("Not enough coins to buy a new row!");
    return;
  }

  coins -= rowCost;
  rowCount++;

  // UNLOCK NEW FRUIT every 3rd row if more fruits remain
  if ((rowCount - 1) % 3 === 0 && symbols.length < allFruits.length) {
    symbols.push(allFruits[symbols.length]);
  }

  // Increase costs
  rowCost = Math.ceil(rowCost + rowCostIncrease + (rowCount / 3));
  updateCoinDisplay();
  document.getElementById("buyRowBtn").textContent = `Buy Row (${rowCost} coins)`;

  document.querySelectorAll('.reels').forEach(col => {
    col.style.setProperty('--rows', rowCount);

    // Find the stack inside this column
    let stack = col.querySelector('.reels-stack');
    if (!stack) {
      // If it doesn't exist, create it
      stack = document.createElement('div');
      stack.className = 'reels-stack';
      col.appendChild(stack);
    }

    // Ensure there are enough symbols
    while (stack.children.length < rowCount) {
      const span = document.createElement('span');
      span.className = 'symbol';
      span.textContent = '❓';
      stack.appendChild(span);
    }
  });

  updateStatsPanel();
  recalculateMinBet();
}

// -----------------------------------------------------------------
//WEIGHTING THE SLOTS WITH MOSTLY COMMON FRUITS

function buildWeightedFruitPool(totalSymbols) {
  // Filter current unlocked symbols by rarity
  const commons = symbols.filter(fruit => commonFruits.includes(fruit));
  const uncommons = symbols.filter(fruit => uncommonFruits.includes(fruit));
  const rares = symbols.filter(fruit => rareFruits.includes(fruit));
  const epics = symbols.filter(fruit => epicFruits.includes(fruit));
  const legendaries = symbols.filter(fruit => legendaryFruits.includes(fruit));
  
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
  // Special case: Allow spin after lost wager saver if coins >= minBet
  if (lostWagerSaver && coins >= minBet) {
    return true;
  }

  // If lostWagerSaver is true AND player doesn't have enough for minBet, block spinning
  if (lostWagerSaver && coins < minBet) {
    showGameAlert("You need to earn more money before you spin again!");
    return false;
  }
  if (isSpinning) return false;
  if (isWagerSaver) return true;

  if (coins < bet) {
    if (coins > 0 && coins < minBet) {
      offerWagerSaver();
    } else if (coins === 0) {
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
  const columns = 3;
  for (let col = 0; col < columns; col++) {
    // Find the reel and its stack
    const reel = document.getElementById(`reel${col}`);
    if (!reel) continue; // If missing, skip (shouldn't happen if set up at page load)
    let stack = reel.querySelector('.reels-stack');
    if (!stack) continue;

    // Clear previous symbols
    stack.innerHTML = '';

    // Fill with all symbols from spinResult[col]
    for (let i = 0; i < spinResult[col].length; i++) {
      const span = document.createElement('span');
      span.className = 'symbol';
      span.textContent = spinResult[col][i];
      stack.appendChild(span);
    }

    // Set visible window height
    reel.style.setProperty('--rows', rowCount);
  }
}


//-----------------------------------------------------------------

//ANIMATES SPIN
function doSpin(frame = 0) {
  const columns = 3;
  const reelLength = spinResult[0].length;
  const totalFrames = reelLength - rowCount + 1;
  const startDelay = 10;
  const endDelay = 500;
  const symbolHeight = 62;

  for (let col = 0; col < columns; col++) {
    const stack = document.querySelector(`#reel${col} .reels-stack`);
    if (stack) {
      const maxOffset = (reelLength - rowCount) * symbolHeight;
      const isFinalFrame = frame >= totalFrames - 1;
      // The offset increases as the animation progresses (scrolls DOWN)
      const offset = -frame * symbolHeight;
      stack.style.transition = 'transform 0.14s cubic-bezier(.25,.8,.5,1)';
      stack.style.transform = `translateY(${isFinalFrame ? -maxOffset : offset}px)`;
    }
  }

  if (frame < totalFrames - 1) {
    const progress = frame / (totalFrames - 1);
    const ease = Math.pow(progress, 3); // Try 3 or 4!
    const delay = startDelay + ((endDelay - startDelay) * ease);
    setTimeout(() => doSpin(frame + 1), delay);
  } else {
    setTimeout(() => {
      checkWin();
      isSpinning = false;
      lostWagerSaver = false;
    }, 150);
  }
}
	
// -----------------------------------------------------------------

//CHECK PAYOUT FOR ANY GIVEN ROW

function calculateRowPayout(symbols, rowIndex) {
  // Count occurrences
  const counts = {};
  for (const sym of symbols) counts[sym] = (counts[sym] || 0) + 1;

  let payout = 0;

  // Major win: all three match
  if (counts[symbols[0]] === 3) {
    let matchSymbol = symbols[0];
    let rarity = "common";
    if (uncommonFruits.includes(matchSymbol)) rarity = "uncommon";
    else if (rareFruits.includes(matchSymbol)) rarity = "rare";
    else if (epicFruits.includes(matchSymbol)) rarity = "epic";
    else if (legendaryFruits.includes(matchSymbol)) rarity = "legendary";

    payout = Math.floor(perRowBet * majorWin * (rarityMultipliers[rarity] || 1));
    currentSpinMajorWins++;

    console.log(`Row ${rowIndex + 1}: Major win! ${matchSymbol} (${rarity}), payout: ${payout}`);
  }
  // Minor win: any two match
  else if (
    symbols[0] === symbols[1] ||
    symbols[1] === symbols[2] ||
    symbols[0] === symbols[2]
  ) {
    // Find which symbol matched
    let matchSymbol;
    if (symbols[0] === symbols[1]) matchSymbol = symbols[0];
    else if (symbols[1] === symbols[2]) matchSymbol = symbols[1];
    else matchSymbol = symbols[0];

    let rarity = "common";
    if (uncommonFruits.includes(matchSymbol)) rarity = "uncommon";
    else if (rareFruits.includes(matchSymbol)) rarity = "rare";
    else if (epicFruits.includes(matchSymbol)) rarity = "epic";
    else if (legendaryFruits.includes(matchSymbol)) rarity = "legendary";

    payout = Math.floor(perRowBet * minorWin * (rarityMultipliers[rarity] || 1));
    currentSpinMinorWins++;
    console.log(`Row ${rowIndex + 1}: Minor win! payout: ${payout}`);
  }
  // No win: payout = 0

  return payout;
}


// ---------------------------------------------------------------

// CHECK WIN COUNT FUNCTION

function checkWin() {
  const columns = 3;
  let totalWin = 0;
  let visibleSymbols = [];

  // Extract the currently displayed symbols (top to bottom)
  for (let row = 0; row < rowCount; row++) {
    visibleSymbols[row] = [];
    for (let col = 0; col < columns; col++) {
      visibleSymbols[row][col] = spinResult[col][row];
    }
  }

  // Loop through each row and calculate payouts
  for (let row = 0; row < rowCount; row++) {
    const rowSymbols = visibleSymbols[row];
    console.log(`Row ${row + 1}:`, rowSymbols);
    let rowPayout = calculateRowPayout(rowSymbols, row);
    totalWin += rowPayout;
  }

  // Handle payout
  if (isWagerSaver) {
    if (totalWin > minBet) {
      coins += totalWin;
      coins += totalWinnings;
      updateStatsPanel();
      updateCoinDisplay();

      // Show user total winnings, as well as major and minor win count
      let resultMsg = `
        Minor Wins: ${currentSpinMinorWins}<br>
        Major Wins: ${currentSpinMajorWins}<br>
        You won ${totalWin} coins!`;
      showGameAlert(resultMsg.trim());

      isWagerSaver = false;
      lostWagerSaver = false;

    } else {
      showGameAlert("You didn't win enough on your Wager Saver spin, go earn some more money!");
      document.getElementById("spinButton").disabled = true;
      isWagerSaver = false;
      lostWagerSaver = true;
    }
  } else {
    if (totalWin > 0) {
      coins += totalWin;
      coins += totalWinnings;
      updateStatsPanel();
      updateCoinDisplay();
      // Show user total winnings, as well as major and minor win count
      let resultMsg = `
        Minor Wins: ${currentSpinMinorWins}<br>
        Major Wins: ${currentSpinMajorWins}<br>
        You won ${totalWin} coins!`;
      showGameAlert(resultMsg.trim());


      lostWagerSaver = false;
    }
  }
}




// -----------------------------------------------------------------
// SPIN FUNCTION
function spin() {
  // Constants
  const columns = 3;
  const reelLength = rowCount + rowAnimationRows;

  //CLEAR ALERT BOX, SHOW SPIN IN PROGRESS TEXT
  showSpinInProgress();

  //VALIDATE SPIN
  if (!validateSpin()) return;
  

  //DEDUCT COINS
  coins -= bet;
  updateCoinDisplay();
  isSpinning = true;
  currentSpinMajorWins = 0;
  currentSpinMinorWins = 0;

  // Build a weighted pool of fruits, using your helper function
  const fruitPool = buildWeightedFruitPool(reelLength);

  // Create the spin result array (columns x reelLength)
  // This will look like: spinResult[col][pos]
  spinResult = [];
  for (let col = 0; col < columns; col++) {
    spinResult[col] = [];
    for (let pos = 0; pos < reelLength; pos++) {
      // Pick a random fruit from the weighted pool
      spinResult[col][pos] = fruitPool[Math.floor(Math.random() * fruitPool.length)];
    }
  }

  // For debugging, log the new spinResult array
  console.log("Spin Result Array:", spinResult);

  fillRows();
  doSpin();
}

// -----------------------------------------------------------------
