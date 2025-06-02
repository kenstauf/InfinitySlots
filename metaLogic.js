const tierButtonEarnings = [null, 
10, 
25, 
100
];

// [0] is unused so index matches tier number (1, 2, 3)


//FUNCTION FOR EVERY BUTTON BASED ON TIER PASSED IN
function clickFreeMoneyBtn(tier) {

//PROGRESS BAR LOGIC
//FIRST WE PULL THE RELEVANT BUTTON
  const progressBarFill = document.getElementById(`freeCoinsBarFill${tier}`);
  const button = document.getElementById(`getFreeCoinsBtn${tier}`);

  // Reset the bar
  if (progressBarFill) {
    progressBarFill.style.transition = 'none';
    progressBarFill.style.width = '0%';
    // Force reflow to apply the reset before animating
    void progressBarFill.offsetWidth;
    // Now animate
    progressBarFill.style.transition = 'width 1s linear';
    progressBarFill.style.width = '100%';
  }

  // disable the button during animation to prevent spam
  if (button) button.disabled = true;

  // After 3 seconds, reset the bar and re-enable the button
  setTimeout(() => {

  //COIN LOGIC
  coins += tierButtonEarnings[tier]; // Add coins for that tier!
  updateCoinDisplay();
    if (progressBarFill) {
      progressBarFill.style.transition = 'none';
      progressBarFill.style.width = '0%';
    }
    if (button) button.disabled = false;
  }, 1000);

}
//-----------------------------------------

function checkForMinBet() {
  if (coins >= minBet) {
    lostWagerSaver = false;
  }
}


//-------------------------------------------

// TIER ONE

document.addEventListener('DOMContentLoaded', () => {
  const btn1 = document.getElementById('getFreeCoinsBtn1');
  if (btn1) {
    btn1.addEventListener('click', function() {
      clickFreeMoneyBtn(1);
      checkforMinBet()
    });
  }
});

//----------------------------------------------------

