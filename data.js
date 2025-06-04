

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
  uncommon: 1.25,    
  rare: 2.25,       
  epic: 3.25,       
  legendary: 5   
};


const baseMinBet = 10;
const rowCostIncrease = 20;
const columns = 5;

const gameState = {
  symbols: allFruits.slice(0, 5), // Start with 5 fruits
  rowCost: 10,
  isSpinning: false,
  coins: 200,
  rowCount: 1,
  bet: 10,
  minorWin: 0.95, // TWO MATCHES
  majorWin: 2.5,  // THREE MATCHES
  megaWin: 3.5,   // FOUR MATCHES
  gigaWin: 6.5,   // FIVE MATCHES
  minBet: baseMinBet,
  totalWinnings: 0,
  isWagerSaver: false,
  spinResult: [],
  perRowBet: 10,
  lostWagerSaver: false,
  currentSpinMinorWins: 0,
  currentSpinMajorWins: 0,
  currentSpinMegaWins: 0,
  currentSpinGigaWins: 0,
  slotSoundVolume: 0.5
};

const maxBet = 10000000000000;
const megaBonus = 300; // Flat mega bonus amount
const perRowMinBet = 10;
let count = 0;
const totalSpins = 8;
const slowspins = 4;
const verySlowSpins = 2;


function getFruitRarity(fruit) {
  if (commonFruits.includes(fruit)) return "common";
  if (uncommonFruits.includes(fruit)) return "uncommon";
  if (rareFruits.includes(fruit)) return "rare";
  if (epicFruits.includes(fruit)) return "epic";
  if (legendaryFruits.includes(fruit)) return "legendary";
  return "common"; // fallback for unknowns
}
