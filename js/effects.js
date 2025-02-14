// effects.js
window.APP = window.APP || {};

window.APP.EFFECTS_CONFIG = {
    floatingHearts: {
        count: 20,
        colors: ['#ff6b95', '#ff8fab', '#ff4d6d', '#ffb3c6', '#ff366a'],
        sizes: ['small', 'medium', 'large'],
        minDuration: 3,
        maxDuration: 8
    },
    heartTrail: {
        maxHearts: 15,
        lifetime: 1000,
        minSize: 10,
        maxSize: 20,
        throttleDelay: 50
    }
};

window.APP.FloatingHeartsManager = class {
    constructor() {
        this.container = document.querySelector('.floating-hearts');
        this.hearts = new Set();
        this.isActive = true;
    }

    initialize() {
        this.container.innerHTML = '';
        const { count } = window.APP.EFFECTS_CONFIG.floatingHearts;
        
        for (let i = 0; i < count; i++) {
            this.createHeart();
        }

        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            this.hearts.forEach(heart => {
                heart.style.animationPlayState = this.isActive ? 'running' : 'paused';
            });
        });
    }

    createHeart() {
        const heart = document.createElement('div');
        const { colors, sizes, minDuration, maxDuration } = window.APP.EFFECTS_CONFIG.floatingHearts;

        heart.className = `floating-heart ${sizes[Math.floor(Math.random() * sizes.length)]}`;
        
        Object.assign(heart.style, {
            left: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            animationDuration: `${minDuration + Math.random() * (maxDuration - minDuration)}s`,
            opacity: 0.6 + Math.random() * 0.4
        });

        this.container.appendChild(heart);
        this.hearts.add(heart);

        heart.addEventListener('animationend', () => {
            this.hearts.delete(heart);
            heart.remove();
            if (this.isActive) {
                this.createHeart();
            }
        });
    }
};

window.APP.HeartTrailManager = class {
    constructor() {
        this.hearts = [];
        this.isEnabled = true;
        this.lastX = 0;
        this.lastY = 0;
        this.throttleTimeout = null;
    }

    initialize() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const handlePointerMove = (e) => {
            if (!this.isEnabled) return;

            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            if (!x || !y) return;

            const distance = Math.hypot(x - this.lastX, y - this.lastY);
            if (distance < 20) return;

            this.lastX = x;
            this.lastY = y;

            if (this.throttleTimeout) return;

            this.createHeart(x, y);
            this.throttleTimeout = setTimeout(() => {
                this.throttleTimeout = null;
            }, window.APP.EFFECTS_CONFIG.heartTrail.throttleDelay);
        };

        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('touchmove', handlePointerMove, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanup();
            }
        });
    }

    createHeart(x, y) {
        const { minSize, maxSize } = window.APP.EFFECTS_CONFIG.heartTrail;
        const heart = document.createElement('div');
        heart.className = 'trail-heart';
        
        const size = minSize + Math.random() * (maxSize - minSize);
        const rotation = Math.random() * 360;
        const color = window.APP.EFFECTS_CONFIG.floatingHearts.colors[
            Math.floor(Math.random() * window.APP.EFFECTS_CONFIG.floatingHearts.colors.length)
        ];

        Object.assign(heart.style, {
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            color: color
        });

        document.body.appendChild(heart);
        this.hearts.push({
            element: heart,
            createdAt: Date.now()
        });

        this.cleanup();
    }

    cleanup() {
        const now = Date.now();
        const { lifetime, maxHearts } = window.APP.EFFECTS_CONFIG.heartTrail;

        this.hearts = this.hearts.filter(heart => {
            if (now - heart.createdAt > lifetime) {
                heart.element.remove();
                return false;
            }
            return true;
        });

        while (this.hearts.length > maxHearts) {
            const heart = this.hearts.shift();
            heart.element.remove();
        }
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
            this.cleanup();
        }
    }
};

window.APP.initializeEffects = function() {
    const heartsManager = new window.APP.FloatingHeartsManager();
    const trailManager = new window.APP.HeartTrailManager();

    heartsManager.initialize();
    trailManager.initialize();

    return {
        toggleHeartTrail: () => trailManager.toggle(),
        toggleFloatingHearts: () => heartsManager.isActive = !heartsManager.isActive
    };
};