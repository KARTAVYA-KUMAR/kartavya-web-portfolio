// Smooth scrolling for navigation links
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 2000; // 0.8 seconds duration for dynamic scrolling
            let start = null;

            window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;

                // Ease in-out cubic function for elegant acceleration/deceleration
                const easeInOutCubic = progress < duration / 2
                    ? 4 * Math.pow(progress / duration, 3)
                    : 1 - Math.pow(-2 * (progress / duration) + 2, 3) / 2;

                const currentPosition = startPosition + distance * easeInOutCubic;
                window.scrollTo(0, currentPosition);

                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    window.scrollTo(0, targetPosition);
                }
            });
        }
    });
});

// Parallax removed per user request
// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Hacker Text Effect on multi-character hover
const hackerLetters = "!1@23#4$%5^&7*89(0)_-+=<,:;{[}}";
const hackerElements = document.querySelectorAll('.b-role, .b-name, .section-title');

hackerElements.forEach(el => {
    const originalText = el.innerText;
    el.innerHTML = '';

    // Group characters into chunks depending on element (4 for b-role, 3 for b-name, 2 for section-title)
    const isBgTitle = el.classList.contains('b-role');
    const isFgTitle = el.classList.contains('b-name');
    const regex = isBgTitle ? /.{1,4}/g : (isFgTitle ? /.{1,3}/g : /.{1,2}/g);
    const chunks = originalText.match(regex) || [];

    chunks.forEach(chunk => {
        // Container element that establishes a rigidly isolated, non-collapsible layout column 
        const span = document.createElement('span');
        span.style.position = 'relative';
        span.style.display = 'inline-block';

        // This element is purely structural. It stays hidden so layout bounding size never shifts.
        const hiddenEl = document.createElement('span');
        hiddenEl.innerText = chunk;
        hiddenEl.style.visibility = 'hidden';

        // This element renders the glitched string perfectly centered on its invisible skeleton.
        const visibleEl = document.createElement('span');
        visibleEl.dataset.value = chunk;
        visibleEl.innerText = chunk;
        visibleEl.style.position = 'absolute';
        visibleEl.style.left = '50%';
        visibleEl.style.top = '0';
        visibleEl.style.transform = 'translateX(-50%)';
        visibleEl.style.whiteSpace = 'nowrap';

        span.appendChild(hiddenEl);
        span.appendChild(visibleEl);

        span.addEventListener('mouseenter', () => {
            clearInterval(span.hackerInterval);

            // Only update the color of the specifically triggered chunk!
            visibleEl.style.color = '#908d8dff';
            // visibleEl.style.textShadow = 'none'; // Temporarily drop heavy strokes if necessary, or just rely on inherited shadow! Keep inherited.
            visibleEl.style.transition = 'color 0.1s ease';

            const scrambleAction = () => {
                visibleEl.innerText = chunk.split('')
                    .map(char => char === ' ' ? ' ' : hackerLetters[Math.floor(Math.random() * hackerLetters.length)])
                    .join('');
            };

            scrambleAction(); // Trigger instantly without delay
            span.hackerInterval = setInterval(scrambleAction, 300); // Continue at slow timing 
        });

        span.addEventListener('mouseleave', () => {
            clearInterval(span.hackerInterval);
            visibleEl.innerText = chunk;
            // Instantly revert to standard font color and hollow effect
            visibleEl.style.color = '';
            visibleEl.style.textShadow = '';
            visibleEl.style.transition = 'color 0.4s ease'; // Smooth fade out
        });

        el.appendChild(span);
    });
});

// Font cycling effect for the word "technologies."
const techWord = document.getElementById('tech-word');
if (techWord) {
    const techFonts = ['"Montserrat Alternates", sans-serif', '"Courier New", Courier, monospace', 'Georgia, serif', '"Impact", sans-serif'];
    let fontIndex = 0;

    const text = techWord.innerText;
    techWord.innerHTML = '';
    techWord.style.position = 'relative';
    techWord.style.display = 'inline-block';

    // Establish fixed maximum responsive boundaries based on Courier New
    const hiddenEl = document.createElement('span');
    hiddenEl.innerText = text;
    hiddenEl.style.fontFamily = '"Courier New", Courier, monospace';
    hiddenEl.style.visibility = 'hidden';

    // Absolutely positioned overlay element that dynamically swaps fonts
    const visibleEl = document.createElement('span');
    visibleEl.innerText = text;
    visibleEl.style.position = 'absolute';
    visibleEl.style.left = '50%';
    visibleEl.style.top = '0';
    visibleEl.style.transform = 'translateX(-50%)';
    visibleEl.style.whiteSpace = 'nowrap';

    techWord.appendChild(hiddenEl);
    techWord.appendChild(visibleEl);

    // Fast cycle execution
    setInterval(() => {
        fontIndex = (fontIndex + 1) % techFonts.length;
        visibleEl.style.fontFamily = techFonts[fontIndex];
    }, 200); // 3x faster speed
}

// ---------------------------------------------
// Universal Scroll Tunneling (Iframe Bounding)
// ---------------------------------------------
// ---------------------------------------------
// Universal Scroll & Mouse Tunneling (Iframe Bounding)
// ---------------------------------------------
window.addEventListener("message", (e) => {
    if (e.data) {
        if (e.data.type === "iframe-scroll") {
            window.scrollBy({ top: e.data.deltaY, behavior: 'auto' });
        } else if (e.data.type === "iframe-mousemove") {
            const iframe = document.querySelector('#skills iframe');
            if (iframe) {
                const rect = iframe.getBoundingClientRect();
                crosshair.target.x = rect.left + e.data.clientX;
                crosshair.target.y = rect.top + e.data.clientY;
                crosshair.active = true;
            }
        } else if (e.data.type === "iframe-mouseout") {
            crosshair.active = false;
        }
    }
});

// ---------------------------------------------
// Custom Circle Cursor
// ---------------------------------------------
const cursorOutline = document.getElementById('cursor-outline');

const crosshair = { // Keep this name for backward compatibility with iframe scrolling code
    current: { x: -100, y: -100 },
    target: { x: -100, y: -100 },
    active: false,
    hovering: false
};

const lerp = (start, end, factor) => start + (end - start) * factor;

window.addEventListener('mousemove', (e) => {
    crosshair.active = true;
    crosshair.target.x = e.clientX;
    crosshair.target.y = e.clientY;
});

window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
        crosshair.active = false;
        if (cursorOutline) cursorOutline.style.opacity = '0';
    }
});

// Hover detection for interactive elements
const interactiveSelectors = 'a, button, input, textarea, select, .play-btn, .project-card, .icon, .painting, .cv-btn, .theme-toggle-btn, .contact-btn, .navbar a, [onclick]';

document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
        crosshair.hovering = true;
        if (cursorOutline) cursorOutline.classList.add('cursor-hover');
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
        crosshair.hovering = false;
        if (cursorOutline) cursorOutline.classList.remove('cursor-hover');
    }
});

// Smooth animation loop for the outline ring
function animateCursor() {
    crosshair.current.x = lerp(crosshair.current.x, crosshair.target.x, 0.15);
    crosshair.current.y = lerp(crosshair.current.y, crosshair.target.y, 0.15);

    if (cursorOutline && crosshair.active) {
        cursorOutline.style.left = crosshair.current.x + 'px';
        cursorOutline.style.top = crosshair.current.y + 'px';
        cursorOutline.style.opacity = '1';
    }

    requestAnimationFrame(animateCursor);
}

animateCursor();

// ---------------------------------------------
// Live Time in Hero Section
// ---------------------------------------------
const updateLiveTime = () => {
    const timeElement = document.getElementById('live-time');
    if (timeElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
};

setInterval(updateLiveTime, 1000);
updateLiveTime();

// ---------------------------------------------
// Hero Scroll Animation & Parallax Engine
// ---------------------------------------------
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const bgTitle = document.querySelector('.bg-title');
            const fgTitle = document.querySelector('.fg-title');

            if (bgTitle) {
                bgTitle.style.transform = `translate3d(${scrollY * 1.5}px, 0, 0)`;
            }
            if (fgTitle) {
                fgTitle.style.transform = `translate3d(${-scrollY * 1.5}px, 0, 0)`;
            }

            const cvBtn = document.querySelector('.cv-btn');
            const themeBtn = document.querySelector('.theme-toggle-btn');

            if (cvBtn) {
                if (scrollY > window.innerHeight * 0.4) {
                    cvBtn.classList.add('hide-away');
                    if (themeBtn) themeBtn.classList.add('slide-right');
                } else {
                    cvBtn.classList.remove('hide-away');
                    if (themeBtn) themeBtn.classList.remove('slide-right');
                }
            }

            document.querySelectorAll('.parallax-item').forEach(item => {
                const speed = parseFloat(item.getAttribute('data-speed')) || 0;
                const rect = item.parentElement.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = (window.innerHeight - rect.top) * speed;
                    item.style.setProperty('--scrollY', `${yPos}px`);
                }
            });

            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// --- ASCII Snake Game Engine ---
const snakeWidth = 41;
const snakeHeight = 4;

let asciiSnake, snakeDir, nextSnakeDir, snakeApple, snakeScore, isGameOver;
let asciiSnakeInterval;
let isSnakePlaying = false;

function initialSnakeRender() {
    asciiSnake = [
        { x: 15, y: 1 },
        { x: 14, y: 1 },
        { x: 13, y: 1 }
    ];
    snakeDir = { x: 1, y: 0 };
    snakeScore = 0;
    isGameOver = false;
    snakeApple = { x: 23, y: 2 };
    drawSnakeGame();
}

function initAsciiSnake() {
    asciiSnake = [
        { x: 15, y: 1 },
        { x: 14, y: 1 },
        { x: 13, y: 1 }
    ];

    snakeDir = { x: 1, y: 0 };
    nextSnakeDir = { x: 1, y: 0 };

    snakeApple = spawnSnakeApple();
    snakeScore = 0;
    isGameOver = false;
    isSnakePlaying = true;

    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "";

    if (asciiSnakeInterval) clearInterval(asciiSnakeInterval);
    asciiSnakeInterval = setInterval(snakeGameLoop, 220); // Slowed down from 150
}

function spawnSnakeApple() {
    return {
        x: Math.floor(Math.random() * snakeWidth),
        y: Math.floor(Math.random() * snakeHeight)
    };
}

function drawSnakeGame() {
    let output = "";
    output += "+-----------------------------------------+\n";
    output += `|  Score: ${snakeScore} | Level: 1      Use Arrow     |\n`;
    output += "+-----------------------------------------+\n";

    for (let y = 0; y < snakeHeight; y++) {
        let row = "|";

        for (let x = 0; x < snakeWidth; x++) {
            let isBody = asciiSnake.some(s => s.x === x && s.y === y);

            if (isBody) row += "O";
            else if (snakeApple.x === x && snakeApple.y === y) row += "@";
            else row += " ";
        }
        row += "|\n";
        output += row;
    }
    output += "+-----------------------------------------+";

    const gameEl = document.getElementById("game");
    if (gameEl) gameEl.textContent = output;
}

function updateSnakeGame() {
    if (isGameOver || !isSnakePlaying) return;

    snakeDir = nextSnakeDir;
    let head = { x: asciiSnake[0].x + snakeDir.x, y: asciiSnake[0].y + snakeDir.y };

    if (
        head.x < 0 || head.y < 0 ||
        head.x >= snakeWidth || head.y >= snakeHeight ||
        asciiSnake.some(s => s.x === head.x && s.y === head.y)
    ) {
        isGameOver = true;
        isSnakePlaying = false;
        const statusEl = document.getElementById("status");
        if (statusEl) statusEl.textContent = "GAME OVER!";
        return;
    }

    asciiSnake.unshift(head);
    if (head.x === snakeApple.x && head.y === snakeApple.y) {
        snakeScore++;
        snakeApple = spawnSnakeApple();
    } else {
        asciiSnake.pop();
    }
}

// Global invocation linking backwards physically to html payload
window.resetGame = function () {
    initAsciiSnake();
};

document.addEventListener("keydown", e => {
    if (isGameOver || !isSnakePlaying) return;
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (keys.includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp" && snakeDir.y === 0) nextSnakeDir = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && snakeDir.y === 0) nextSnakeDir = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && snakeDir.x === 0) nextSnakeDir = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && snakeDir.x === 0) nextSnakeDir = { x: 1, y: 0 };
});

// Mobile D-Pad Handlers
function setupMobileDPad() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if(btnUp) btnUp.addEventListener('touchstart', (e) => { e.preventDefault(); if (!isGameOver && isSnakePlaying && snakeDir.y === 0) nextSnakeDir = { x: 0, y: -1 }; });
    if(btnDown) btnDown.addEventListener('touchstart', (e) => { e.preventDefault(); if (!isGameOver && isSnakePlaying && snakeDir.y === 0) nextSnakeDir = { x: 0, y: 1 }; });
    if(btnLeft) btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); if (!isGameOver && isSnakePlaying && snakeDir.x === 0) nextSnakeDir = { x: -1, y: 0 }; });
    if(btnRight) btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); if (!isGameOver && isSnakePlaying && snakeDir.x === 0) nextSnakeDir = { x: 1, y: 0 }; });
}
setupMobileDPad();

function snakeGameLoop() {
    updateSnakeGame();
    drawSnakeGame();
}

// Fire independently out of bounds mapping to static rendering natively 
if (document.getElementById("game")) {
    initialSnakeRender();
}

// --- Typewriter Effect for Hero Title ---
const greetingStrings = [
    "Hi there, I'm",
    "नमस्ते, मैं हूँ",
    "Hola, soy",
    "Salut, je suis",
    "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਹਾਂ"
];
let greetIdx = 0;
let charIdx = 0;
let isGreetDeleting = false;
let typeSpeed = 100;

function runTypewriter() {
    const typeEl = document.getElementById("typewriter-hi");
    if (!typeEl) return;

    const currentStr = greetingStrings[greetIdx];

    if (isGreetDeleting) {
        typeEl.innerText = currentStr.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 50;
    } else {
        typeEl.innerText = currentStr.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 110;
    }

    if (!isGreetDeleting && charIdx === currentStr.length) {
        isGreetDeleting = true;
        typeSpeed = 2000;
    } else if (isGreetDeleting && charIdx === 0) {
        isGreetDeleting = false;
        greetIdx = (greetIdx + 1) % greetingStrings.length;
        typeSpeed = 600;
    }

    setTimeout(runTypewriter, typeSpeed);
}

if (document.getElementById("typewriter-hi")) {
    // We already have "Hi there, I'm" directly in HTML, so we start deleting instead of typing!
    charIdx = greetingStrings[0].length;
    isGreetDeleting = true;
    setTimeout(runTypewriter, 2000); // 2 second reading gap before first backspace
}

// --- Alphabet Music Bars Canvas ---
function initMusicCanvas() {
    const canvas = document.getElementById("musicCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // We rely on HTML width="220" and height="70"
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const columns = 13;
    const maxRows = 6; // Natively constrained safely avoiding clipping

    const cellWidth = canvasWidth / columns;
    const cellHeight = canvasHeight / maxRows;

    const baseLetters = "qazw['fsxedcrfvtg{?/}-=_=byhnujmikolp";

    let grid = [];
    for (let i = 0; i < columns; i++) {
        grid[i] = [];
        for (let j = 0; j < maxRows; j++) {
            grid[i][j] = baseLetters[(i + j) % baseLetters.length];
        }
    }

    let offsets = [];
    for (let i = 0; i < columns; i++) {
        offsets.push(Math.random() * Math.PI * 2);
    }

    let time = 0;

    function animateMusicBars() {
        requestAnimationFrame(animateMusicBars);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Inherit exact font rendering params from HTML smoothly targeting user image context
        ctx.fillStyle = "#666";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";

        for (let i = 0; i < columns; i++) {
            let columnHeight;
            if (i === 1) columnHeight = Math.round((4 / 10) * maxRows + Math.sin(time + offsets[i]) * 1);
            else if (i === 4) columnHeight = Math.round((6 / 10) * maxRows + Math.sin(time + offsets[i]) * 1);
            else if (i === 6) columnHeight = Math.round((3 / 10) * maxRows + Math.sin(time + offsets[i]) * 1);
            else if (i === 9) columnHeight = Math.round((7 / 10) * maxRows + Math.sin(time + offsets[i]) * 1);
            else if (i === 10) columnHeight = Math.round((2 / 10) * maxRows + Math.sin(time + offsets[i]) * 1);
            else columnHeight = Math.round(((Math.sin(time + offsets[i]) + 1) / 2) * maxRows);

            columnHeight = Math.max(0, Math.min(columnHeight, maxRows));

            for (let j = 0; j < columnHeight; j++) {
                let x = i * cellWidth + cellWidth / 2;
                let y = canvasHeight - (j * cellHeight) - 2;
                ctx.fillText(grid[i][j], x, y);
            }
        }
        time += 0.15;
    }
    animateMusicBars();
}

if (document.getElementById("musicCanvas")) {
    initMusicCanvas();
}

// ---------------------------------------------
// Dark Mode Toggle
// ---------------------------------------------
const themeToggleBtn = document.getElementById('theme-toggle');

// Apply saved theme on load (prevents flash)
(function applyStoredTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
        }

        // Rotate animation on the button
        themeToggleBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 400);
    });
}
