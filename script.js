// --- Animated Sky, Sun/Moon, Clouds, and Stars ---
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
let skyState = 0; // 0: day, 1: evening, 2: night
let lastWeatherScore = 0;
let clouds = Array.from({ length: 4 }, (_, i) => ({ x: 80 * i, y: 40 + Math.random() * 60, speed: 0.18 + Math.random() * 0.12, size: 0.7 + Math.random() * 0.5 }));
let stars = Array.from({ length: 30 }, () => ({ x: Math.random() * 320, y: Math.random() * 480, tw: Math.random() * 2 }));

function lerpColor(a, b, t) {
    return `rgb(${a[0]+(b[0]-a[0])*t|0},${a[1]+(b[1]-a[1])*t|0},${a[2]+(b[2]-a[2])*t|0})`;
}

function drawCloud(ctx, x, y, size) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 15 * size, 0, 2 * Math.PI);
    ctx.arc(x + 12 * size, y, 12 * size, 0, 2 * Math.PI);
    ctx.arc(x + 20 * size, y, 10 * size, 0, 2 * Math.PI);
    ctx.arc(x + 8 * size, y - 8 * size, 10 * size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

function drawSkyBG() {
    if (!bgCtx) return;
    // Weather state changes every 10 points
    let currentScore = typeof score !== 'undefined' ? score : 0;
    if (currentScore - lastWeatherScore >= 10) {
        skyState = (skyState + 1) % 3;
        lastWeatherScore = currentScore;
    }
    let col1, col2;
    if (skyState === 0) { // Day
        col1 = 'rgb(135,206,250)';
        col2 = 'rgb(255,255,255)';
    } else if (skyState === 1) { // Evening
        col1 = 'rgb(255,183,197)';
        col2 = 'rgb(255,236,179)';
    } else { // Night
        col1 = 'rgb(44,62,80)';
        col2 = 'rgb(44,62,80)';
    }
    let grad = bgCtx.createLinearGradient(0, 0, 0, 480);
    grad.addColorStop(0, col1);
    grad.addColorStop(1, col2);
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, 320, 480);
    // Sun/Moon
    let sunY = 120 + Math.sin(Date.now() / 2000) * 30;
    if (skyState !== 2) { // Sun
        bgCtx.beginPath();
        bgCtx.arc(260, sunY, 28, 0, 2 * Math.PI);
        bgCtx.fillStyle = 'rgba(255,236,179,0.95)';
        bgCtx.shadowColor = '#fff9c4';
        bgCtx.shadowBlur = 24;
        bgCtx.fill();
        bgCtx.shadowBlur = 0;
    } else { // Moon
        bgCtx.beginPath();
        bgCtx.arc(60, sunY, 20, 0, 2 * Math.PI);
        bgCtx.fillStyle = 'rgba(255,255,255,0.85)';
        bgCtx.shadowColor = '#fff';
        bgCtx.shadowBlur = 16;
        bgCtx.fill();
        bgCtx.shadowBlur = 0;
        // Crescent
        bgCtx.globalCompositeOperation = 'destination-out';
        bgCtx.beginPath();
        bgCtx.arc(66, sunY - 4, 16, 0, 2 * Math.PI);
        bgCtx.fill();
        bgCtx.globalCompositeOperation = 'source-over';
    }
    // Clouds always move
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > 340) cloud.x = -60;
        drawCloud(bgCtx, cloud.x, cloud.y, cloud.size);
    });
    // Stars at night
    if (skyState === 2) {
        stars.forEach(star => {
            let tw = 0.7 + 0.3 * Math.sin(Date.now() / 300 + star.tw);
            bgCtx.globalAlpha = tw;
            bgCtx.beginPath();
            bgCtx.arc(star.x, star.y, 1.1 + tw, 0, 2 * Math.PI);
            bgCtx.fillStyle = '#fff';
            bgCtx.fill();
            // Sparkle
            if (Math.random() < 0.01) {
                bgCtx.beginPath();
                bgCtx.arc(star.x, star.y, 2.5, 0, 2 * Math.PI);
                bgCtx.fillStyle = '#fff8';
                bgCtx.fill();
            }
            bgCtx.globalAlpha = 1;
        });
    }
}

function bgLoop() {
    drawSkyBG();
    requestAnimationFrame(bgLoop);
}
if (bgCanvas && bgCtx) bgLoop();

// --- Animated Hearts in Game Section ---
function spawnGameHearts() {
    const bg = document.getElementById('game-hearts-bg');
    if (!bg) return;
    bg.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const span = document.createElement('span');
        span.textContent = ['💖', '💗', '💓', '💞', '💕'][Math.floor(Math.random() * 5)];
        span.style.left = Math.random() * 90 + '%';
        span.style.bottom = '-2rem';
        span.style.animationDelay = (Math.random() * 3) + 's';
        span.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
        bg.appendChild(span);
    }
}

if (document.getElementById('game-hearts-bg')) {
    spawnGameHearts();
    setInterval(spawnGameHearts, 4000);
}

// --- Floating Teddy Fade In ---
const floatingTeddy = document.getElementById('floating-teddy');
if (floatingTeddy) {
    floatingTeddy.style.opacity = 0;
    setTimeout(() => {
        floatingTeddy.style.transition = 'opacity 1.2s';
        floatingTeddy.style.opacity = 1;
    }, 800);
}

// --- Flappy Bird Mini-Game Logic ---
const gameSection = document.getElementById('game-section');
const canvas = document.getElementById('flappy-canvas');
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
const gameOverBox = document.getElementById('game-over');
const scoreMsg = document.getElementById('score-msg');
const playAgainBtn = document.getElementById('play-again');
const rewardMsg = document.getElementById('reward-msg');

if (canvas && ctx && gameSection && gameOverBox && scoreMsg && playAgainBtn && rewardMsg) {
    const launchGameBtn = document.getElementById('launch-game-btn');
    if (launchGameBtn) {
        launchGameBtn.addEventListener('click', function() {
            launchGameBtn.style.display = 'none';
            gameSection.classList.remove('hidden');
            window.startFlappyGame();
        });
    }

    let gameActive = false;
    let bird, pipes, score, bestScore = 0,
        reward = 0,
        rewardPerPoint = 10;
    let gravity = 0.28;
    let jump = -5.5;
    let pipeGap = 120;
    let pipeWidth = 44;
    let pipeSpeed = 2.2;
    let frame = 0;

    function resetGame() {
        bird = {
            x: 60,
            y: canvas.height / 2,
            vy: 0,
            r: 18
        };
        pipes = [];
        score = 0;
        frame = 0;
        rewardPerPoint = Math.floor(Math.random() * 16) + 5; // 5-20
        gameActive = true;
        gameOverBox.classList.add('hidden');
        rewardMsg.textContent = '';
        skyState = 0;
        lastWeatherScore = 0;
    }

    function endGame() {
        gameActive = false;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('flappyBestScore', bestScore);
        }
        reward = score * rewardPerPoint;
        scoreMsg.innerHTML = `Score: <b>${score}</b><br>Best: <b>${bestScore}</b><br>Reward: <b>${reward}</b> 💝`;
        rewardMsg.textContent = `Bhangu Ji gets ${reward} kisses! 😘`;
        gameOverBox.classList.remove('hidden');
    }

    function drawBird() {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.ellipse(bird.x, bird.y + bird.r + 7, bird.r * 0.95, bird.r * 0.35, 0, 0, 2 * Math.PI);
        ctx.fillStyle = '#444';
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        // Flapping wings (simple sine animation)
        const t = Date.now() / 180;
        const wingAngle = Math.sin(t) * 0.5 + 0.7;
        ctx.save();
        ctx.translate(bird.x, bird.y);
        // Left wing
        ctx.save();
        ctx.rotate(-wingAngle);
        ctx.beginPath();
        ctx.ellipse(-bird.r * 0.7, 0, bird.r * 0.7, bird.r * 0.32, 0, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff6f8';
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
        // Right wing
        ctx.save();
        ctx.rotate(wingAngle);
        ctx.beginPath();
        ctx.ellipse(bird.r * 0.7, 0, bird.r * 0.7, bird.r * 0.32, 0, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff6f8';
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, bird.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffb6b9';
        ctx.shadowColor = '#ff6f91';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Face (eyes, beak, blush)
        // Eyes (blink every ~2s for 0.15s)
        const blink = (Math.floor(Date.now() / 2000) % 10 === 0);
        ctx.save();
        ctx.fillStyle = '#222';
        if (!blink) {
            ctx.beginPath();
            ctx.arc(-6, -3, 2.2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(6, -3, 2.2, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.fillRect(-8, -3, 4, 1.2);
            ctx.fillRect(4, -3, 4, 1.2);
        }
        ctx.restore();
        // Beak
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(-2, 7);
        ctx.lineTo(2, 7);
        ctx.closePath();
        ctx.fillStyle = '#ffdb7b';
        ctx.fill();
        ctx.restore();
        // Blush
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(-6, 3, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff6f91';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, 3, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff6f91';
        ctx.fill();
        ctx.restore();
        ctx.restore();
    }

    function drawPipe(pipe) {
        // Glossy gradient
        function glossyRect(x, y, w, h, color1, color2) {
            let grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, color1);
            grad.addColorStop(0.5, color2);
            grad.addColorStop(1, color1);
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            // Shimmer
            ctx.save();
            ctx.globalAlpha = 0.18 + 0.12 * Math.sin(Date.now() / 600 + x);
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.18, h * 0.25);
            ctx.restore();
        }
        ctx.save();
        ctx.lineWidth = 2.2;
        // Top pipe
        glossyRect(pipe.x, 0, pipeWidth, pipe.top, '#b5ead7', '#3aafa9');
        ctx.strokeStyle = '#3aafa9';
        ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);
        // Bottom pipe
        glossyRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom, '#b5ead7', '#3aafa9');
        ctx.strokeStyle = '#3aafa9';
        ctx.strokeRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
        ctx.restore();
    }

    function drawScore() {
        ctx.save();
        ctx.font = 'bold 28px "Press Start 2P", cursive';
        ctx.fillStyle = '#ff6f91';
        ctx.textAlign = 'center';
        ctx.fillText(score, canvas.width / 2, 60);
        ctx.restore();
    }

    function update() {
        if (!gameActive) return;
        frame++;
        // Bird physics
        bird.vy += gravity;
        bird.y += bird.vy;
        // Pipes
        if (frame % 80 === 0) {
            let top = Math.random() * (canvas.height - pipeGap - 80) + 30;
            pipes.push({
                x: canvas.width,
                top: top,
                bottom: top + pipeGap,
                passed: false
            });
        }
        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;
            // Score
            if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
                score++;
                pipes[i].passed = true;
            }
            // Remove off-screen pipes
            if (pipes[i].x + pipeWidth < 0) pipes.splice(i, 1);
        }
        // Collision
        for (let pipe of pipes) {
            if (
                bird.x + bird.r > pipe.x &&
                bird.x - bird.r < pipe.x + pipeWidth &&
                (bird.y - bird.r < pipe.top || bird.y + bird.r > pipe.bottom)
            ) {
                endGame();
                return;
            }
        }
        // Ground/ceiling
        if (bird.y + bird.r > canvas.height || bird.y - bird.r < 0) {
            endGame();
            return;
        }
        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Pipes
        for (let i = 0; i < pipes.length; i++) drawPipe(pipes[i]);
        // Bird
        drawBird();
        // Score
        drawScore();
    }

    function flap() {
        if (!gameActive) return;
        bird.vy = jump;
    }

    // Event listeners
    canvas.addEventListener('mousedown', function(e) {
        if (!gameActive) {
            resetGame();
            draw();
            requestAnimationFrame(update);
        } else {
            flap();
        }
    });
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameActive) {
            resetGame();
            draw();
            requestAnimationFrame(update);
        } else {
            flap();
        }
    }, { passive: false });
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.key === ' ') flap();
    });
    playAgainBtn.addEventListener('click', function() {
        resetGame();
        draw();
        requestAnimationFrame(update);
    });

    // Optionally, expose a function to show the game section from other UI
    window.startFlappyGame = function() {
        gameSection.classList.remove('hidden');
        resetGame();
        draw();
        requestAnimationFrame(update);
    };
}

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
    let heartEmojis = ['💖', '💗', '💓', '💞', '💕'];
    let interval = setInterval(() => {
        if (document.getElementById('celebration').classList.contains('hidden')) {
            clearInterval(interval);
            return;
        }
        const heart = document.createElement('span');
        heart.className = 'falling-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 80 + 10 + '%';
        heart.style.fontSize = (1.7 + Math.random() * 1.2) + 'rem';
        heart.style.animationDuration = (2.2 + Math.random() * 1.2) + 's';
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
