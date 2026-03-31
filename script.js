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
const hackerElements = document.querySelectorAll('.bg-title, .fg-title, .section-title');

hackerElements.forEach(el => {
    const originalText = el.innerText;
    el.innerHTML = '';

    // Group characters into chunks depending on element (3 for bg-title, 2 for fg-title, 1 for section-title)
    const isBgTitle = el.classList.contains('bg-title');
    const isFgTitle = el.classList.contains('fg-title');
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
            visibleEl.style.color = '#707072ff';
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
// Interactive Crosshair Canvas Cursor
// ---------------------------------------------
const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

window.addEventListener("resize", () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
});

const crosshair = {
    current: { x: w / 2, y: h / 2 },
    target: { x: w / 2, y: h / 2 },
    active: false
};

window.addEventListener("mousemove", (e) => {
    crosshair.active = true;
    crosshair.target.x = e.clientX;
    crosshair.target.y = e.clientY;
});

window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && !e.toElement) {
        crosshair.active = false;
    }
});

const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
};

const drawCrosshair = () => {
    ctx.clearRect(0, 0, w, h);

    // Smooth physics lag mapped natively to standard coordinates
    crosshair.current.x = lerp(crosshair.current.x, crosshair.target.x, 0.15);
    crosshair.current.y = lerp(crosshair.current.y, crosshair.target.y, 0.15);

    if (crosshair.active) {
        ctx.beginPath();
        // Horizontal axis
        ctx.moveTo(0, crosshair.current.y);
        ctx.lineTo(w, crosshair.current.y);
        // Vertical axis
        ctx.moveTo(crosshair.current.x, 0);
        ctx.lineTo(crosshair.current.x, h);

        ctx.strokeStyle = '#837878';
        ctx.lineWidth = 1.25;
        ctx.stroke();

        // Exact intersection nexus square
        ctx.fillStyle = '#837878';
        const squareSize = 6;
        ctx.fillRect(
            crosshair.current.x - squareSize / 2,
            crosshair.current.y - squareSize / 2,
            squareSize,
            squareSize
        );
    }

    requestAnimationFrame(drawCrosshair);
};

drawCrosshair();

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
            if (cvBtn) {
                if (scrollY > window.innerHeight * 0.4) {
                    cvBtn.classList.add('hide-away');
                } else {
                    cvBtn.classList.remove('hide-away');
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
