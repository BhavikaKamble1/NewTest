
// Messages and corresponding gifs for each 'No' click
const noMoments = [
  { msg: "Are you sure? 🥺👉👈", gif: "dubu3.gif", alt: "Teddy pinching cheeks" },
  { msg: "But I brought you flowers! 🌸🌼", gif: "dubu7.gif", alt: "Teddy giving cheek kiss" },
  { msg: "Look, a sad puppy! 🐶😭", gif: "dubu9.gif", alt: "Teddy dancing sadly" },
  { msg: "Teddy is crying now... 🧸💧", gif: "dubu1.gif", alt: "Teddy lifting another teddy" },
  { msg: "Please? I'll be extra sweet! 🍯", gif: "dubu8.gif", alt: "Teddy holding and rotating" },
  { msg: "I'll give you all the hugs! 🤗", gif: "dubu5.gif", alt: "Teddy hugging and swirling" },
  { msg: "You are my everything! 💗", gif: "dubu10.gif", alt: "Teddy cheek kiss" },
  { msg: "No? But... I love you so much! 💞", gif: "dubu4.gif", alt: "Teddy kissing each other" },
  { msg: "Okay, last chance! Will you forgive me? 🥹💖", gif: "dubu6.gif", alt: "Teddy on happy scooty ride" }
];


let noClickCount = 0;
const noBtn = document.getElementById('no-btn');
const acceptBtn = document.getElementById('accept-btn');
const mainMessage = document.getElementById('main-message');
const popup = document.getElementById('cute-popup');
const celebration = document.getElementById('celebration');
const confettiDiv = document.querySelector('.confetti');
const mainGif = document.getElementById('main-gif');

function showPopup(msg) {
  popup.textContent = msg;
  popup.classList.remove('hidden');
}

function hidePopup() {
  popup.classList.add('hidden');
}

// Make the No button move only a few times, then stay put for accessibility
const MAX_MOVES = 3;

function moveNoButton() {
  if (noClickCount >= 3 && noClickCount < 3 + MAX_MOVES) {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    // On mobile, use smaller movement area
    const isMobile = window.innerWidth <= 600;
    const padding = isMobile ? 10 : 30;
    const maxX = Math.max(5, rect.width - btnRect.width - padding);
    const maxY = Math.max(5, rect.height - btnRect.height - (isMobile ? 30 : 80));
    const randX = Math.random() * maxX;
    const randY = Math.random() * maxY + (isMobile ? 30 : 80);
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${randX}px`;
    noBtn.style.top = `${randY}px`;
  } else if (noClickCount >= 3 + MAX_MOVES) {
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
  }
}

// Use mouseover for desktop, touchstart for mobile
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton);


noBtn.addEventListener('click', () => {
  if (noClickCount < noMoments.length) {
    const moment = noMoments[noClickCount];
    showPopup(moment.msg);
    mainGif.src = moment.gif;
    mainGif.alt = moment.alt;
    noClickCount++;
    if (noClickCount >= 3) {
      noBtn.textContent = "No 😢";
    }
  } else {
    showPopup("You can't say no forever! 😘");
    mainGif.src = "dubu1.gif";
    mainGif.alt = "Teddy lifting another teddy";
    noClickCount = 0; // Reset so the fun can continue
  }
  // Always keep the button enabled and visible
  noBtn.disabled = false;
  noBtn.style.position = noClickCount >= 3 ? 'absolute' : '';
});





acceptBtn.addEventListener('click', () => {
  document.querySelector('.buttons').classList.add('hidden');
  mainMessage.classList.add('hidden');
  hidePopup();
  // Show only 3 special gifs in the celebration area
  const specialGifs = [
    { src: 'dubu.gif', alt: 'Two teddy bears kissing' },
    { src: 'dubu5.gif', alt: 'Teddy hugging and swirling' },
    { src: 'dubu8.gif', alt: 'Teddy holding her and rotating round' }
  ];
  const teddiesDiv = document.getElementById('celebration-teddies');
  teddiesDiv.innerHTML = specialGifs.map(gif => `<img src="${gif.src}" alt="${gif.alt}" class="teddy-gif celebration-gif" />`).join('');
  // Start falling hearts
  startFallingHearts();
  // Start celebration scroll animation (already handled by CSS)
  celebration.classList.remove('hidden');
  // Confetti
  launchConfetti();
});

// Falling hearts effect
function startFallingHearts() {
  const heartsContainer = document.getElementById('falling-hearts');
  if (!heartsContainer) return;
  heartsContainer.innerHTML = '';
  let heartEmojis = ['💖','💗','💓','💞','💕'];
  let interval = setInterval(() => {
    if (document.getElementById('celebration').classList.contains('hidden')) {
      clearInterval(interval);
      return;
    }
    const heart = document.createElement('span');
    heart.className = 'falling-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
    heart.style.left = Math.random() * 80 + 10 + '%';
    heart.style.fontSize = (1.7 + Math.random()*1.2) + 'rem';
    heart.style.animationDuration = (2.2 + Math.random()*1.2) + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }, 300);
}

// Blinking hearts
function createBlinkingHearts() {
  const heartsBar = document.getElementById('hearts-bar');
  if (!heartsBar) return;
  heartsBar.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('span');
    heart.className = 'blinking-heart';
    heart.textContent = '💖';
    heart.style.animationDelay = `${i * 0.3}s`;
    heartsBar.appendChild(heart);
  }
}
createBlinkingHearts();

function launchConfetti() {
  confettiDiv.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti-piece';
    conf.style.background = randomColor();
    conf.style.left = Math.random() * 100 + '%';
    conf.style.animationDelay = (Math.random() * 0.7) + 's';
    confettiDiv.appendChild(conf);
  }
}

function randomColor() {
  const colors = ['#FFD1DC', '#B5EAD7', '#FFDAC1', '#C7CEEA', '#FFB7B2', '#FF9AA2'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Confetti CSS
const style = document.createElement('style');
style.innerHTML = `
.confetti-piece {
  position: absolute;
  top: -20px;
  width: 12px;
  height: 18px;
  border-radius: 6px;
  opacity: 0.8;
  animation: confetti-fall 1.7s linear forwards;
}
@keyframes confetti-fall {
  to {
    top: 100%;
    transform: rotate(360deg);
    opacity: 0.2;
  }
}`;
document.head.appendChild(style);

// Reset No button position on resize
window.addEventListener('resize', () => {
  noBtn.style.position = '';
  noBtn.style.left = '';
  noBtn.style.top = '';
});
