

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


    let symbols = allFruits.slice(0, 5); // Start with 5 fruits

    let rowCost = 10;
    let isSpinning = false;
    let coins = 200;
    let rowCount = 1;
    let bet = 10;
    let minorWin = .30; //TWO MATCHES
    let majorWin = 1.5; //THREE MATCHES
    let megaWin = 2; //FOUR MATCHES
    let gigaWin = 3.5; //FIVE MATCHES
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
    let perRowBet = bet / rowCount;
    let lostWagerSaver = false;
    const columns = 5;
    let currentSpinMinorWins = 0;
    let currentSpinMajorWins = 0;
    let currentSpinMegaWins = 0;
    let currentSpinGigaWins = 0;



function getFruitRarity(fruit) {
  if (commonFruits.includes(fruit)) return "common";
  if (uncommonFruits.includes(fruit)) return "uncommon";
  if (rareFruits.includes(fruit)) return "rare";
  if (epicFruits.includes(fruit)) return "epic";
  if (legendaryFruits.includes(fruit)) return "legendary";
  return "common"; // fallback for unknowns
}
