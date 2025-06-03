# Infinity Slots

Infinity Slots is a browser-based slot machine written in vanilla HTML and JavaScript. Players spin reels of fruit, unlock additional rows, and accumulate coins. Progress is stored in `localStorage` so the game can continue across sessions.

## Code Structure

- `index.html` – page layout and UI.
- `data.js` – fruit symbols, rarity data and game variables.
- `main.js` – bootstraps the UI and event listeners when the page loads.
- `ui.js` – helper functions for updating stats, coin display and general UI behaviour.
- `gameLogic.js` – core gameplay: calculating minimum bet, performing spins and determining payouts.
- `metaLogic.js` – extra features such as free coin buttons.
- `saveLogic.js` – saves and loads the player's progress.
- `shaders.js` – adds a glow effect to interactive elements.

## Key Functions

- `calcMinBet(rowCount)` in **gameLogic.js** computes the minimum bet based on the current row count.
- `buyRow()` in **gameLogic.js** unlocks a new row, increases costs and updates the UI.
- `validateSpin()` in **gameLogic.js** ensures the player can spin, optionally offering a "wager saver" spin if coins are low.
- `fillRows()` and `doSpin()` in **gameLogic.js** populate reels with fruits, animate them and call `checkWin()`.
- `calculateRowPayout(symbols, rowIndex)` in **gameLogic.js** returns a payout for matches on a single row.
- `checkWin()` in **gameLogic.js** totals payouts and updates coins, winnings and stats.
- `updateStatsPanel()` and `updateCoinDisplay()` in **ui.js** refresh the visible stats and coin count.

## Running the Game

Simply open `index.html` in a modern browser. Use the buttons to adjust your bet, spin the reels and buy more rows. Coins and progress are stored locally so your game persists between visits.

---

The primary developer allowed Codex to analyze the code base and write this README as a test of how well the assistant works.
