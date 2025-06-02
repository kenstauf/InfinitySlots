

const commonFruits = [
  "🍒", // Cherry
  "🍋", // Lemon
  "🍇" // Grape
];


const uncommonFruits = [
  "🍍", // Pineapple
  "🥝", // Kiwi
  "🍈", // Melon
  "🍐", // Pear
  "🍑", // Peach
  "🍅", // Tomato
  "🥕", // Carrot
  "🍓", // Strawberry
  "🍊", // Orange
  "🍎", // Red Apple
  "🍏", // Green Apple
  "🍌"  // Banana
];


const rareFruits = [
  "🥥", // Coconut
  "🥭", // Mango
  "🫐", // Blueberry
  "🍆", // Eggplant
  "🍠", // Sweet Potato
  "🥔", // Potato
  "🌽", // Corn
  "🥒", // Cucumber
  "🥑",  // Avocado
  "🍉" // Watermelon
];


const epicFruits = [
  "🍫", // Chocolate
  "🍩", // Donut
  "🍬",  // Candy
  "🍪", // Cookie
  "🍿"  // Popcorn
];

const legendaryFruits = [
  "🍭" // Lollipop (unique, appears only here)
];

// Build the full array

function buildAllFruitsArray() {
  return [
    ...commonFruits,
    ...uncommonFruits,
    ...rareFruits,
    ...epicFruits,
    ...legendaryFruits
  ];
}

const allFruits = buildAllFruitsArray();


//Rarity multipliers for fruits

const rarityMultipliers = {
  common: 1,      // No bonus
  uncommon: 2,    // 2x
  rare: 5,        // 5x
  epic: 10,       // 10x
  legendary: 25   // 25x (or whatever you want the jackpot to be)
};


    let symbols = allFruits.slice(0, 3); // Start with 5 fruits

    let rowCost = 10;
    let isSpinning = false;
    let coins = 200;
    let rowCount = 1;
    let bet = 10;
    let minorWin = 2;
    let majorWin = 4;
    const baseMinBet = 10;
    let minBet = baseMinBet;
    const maxBet = 10000000000000;
    let totalWinnings = 0;
    const megaBonus = 300; // Flat mega bonus amount
    let isWagerSaver = false;
    const perRowMinBet = 10;
    const rowCostIncrease = 20;
    let count = 0;
    const totalSpins = 8;
    const slowspins = 4;
    const verySlowSpins = 2;
    let spinResult = [];
    let rowAnimationRows = Math.floor(rowCount / 3) + 10;
    let perRowBet = bet / rowCount;
    let currentSpinMinorWins = 0;
    let currentSpinMajorWins = 0;
    let lostWagerSaver = false;



function getFruitRarity(fruit) {
  if (commonFruits.includes(fruit)) return "common";
  if (uncommonFruits.includes(fruit)) return "uncommon";
  if (rareFruits.includes(fruit)) return "rare";
  if (epicFruits.includes(fruit)) return "epic";
  if (legendaryFruits.includes(fruit)) return "legendary";
  return "common"; // fallback for unknowns
}
