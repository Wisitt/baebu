// main.js 

window.APP = window.APP || {};

window.APP.Main = class {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.config = window.APP.CONFIG;
    }

    async initialize() {
        try {
            // Initialize all components
            window.APP.animations.initialize();
            window.APP.initializeMemoryGame();
            window.APP.initializeTimers();
            window.APP.initializeMusicPlayer();
            window.APP.initializeEffects();

            this.setupEventListeners();
            this.hideLoadingScreen();
            this.showWelcomeMessage();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }

    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }

    showWelcomeMessage() {
        const message = document.createElement('div');
        message.className = 'welcome-message glass-effect';
        message.innerHTML = `
            <h3>Welcome, ${this.config.username}! ❤️</h3>
            <p>Happy Valentine's Day!</p>
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message glass-effect';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new window.APP.Main();
    app.initialize();
});