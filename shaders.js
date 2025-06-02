//ADD GLOW EFFECT

function addGlow(element) {
  element.style.boxShadow = "0 0 12px 4px #ffe066, 0 0 42px 12px #fff80088";
}

//REMOVE GLOW EFFECT

function removeGlow(element) {
  element.style.boxShadow = ""; // Removes the glow
}

//-------------------------------

//APPLY GLOW TO ALL .BTN CLASS OBJECTS

document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => addGlow(btn));
    btn.addEventListener('mouseleave', () => removeGlow(btn));
  });
});
