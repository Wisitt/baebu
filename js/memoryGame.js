// memoryGame.js 

window.APP = window.APP || {};

window.APP.MemoryGame = class {
    constructor() {
        this.container = document.querySelector('.card-grid');
        this.moveCount = document.getElementById('moveCount');
        this.timer = document.getElementById('gameTimer');
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.timerInterval = null;
        this.isLocked = false;
        
        this.memories = [
            { id: 1, image: 'first-date.jpg', description: 'Our First Date' },
            { id: 2, image: 'first-kiss.jpg', description: 'First Kiss' },
            { id: 3, image: 'anniversary.jpg', description: 'Anniversary' },
            { id: 4, image: 'vacation.jpg', description: 'Our Vacation' },
            { id: 5, image: 'proposal.jpg', description: 'The Proposal' },
            { id: 6, image: 'wedding.jpg', description: 'Our Wedding' },
            { id: 7, image: 'honeymoon.jpg', description: 'Honeymoon' },
            { id: 8, image: 'celebration.jpg', description: 'Celebration' }
        ];
    }

    initialize() {
        this.createCards();
        this.setupEventListeners();
    }

    createCards() {
        const duplicatedMemories = [...this.memories, ...this.memories];
        this.cards = this.shuffle(duplicatedMemories);
        
        this.container.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            this.container.appendChild(cardElement);
        });
    }

    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index;
        cardElement.dataset.id = card.id;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="assets/images/${card.image}" alt="${card.description}">
                    <p>${card.description}</p>
                </div>
            </div>
        `;

        return cardElement;
    }

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const card = e.target.closest('.memory-card');
            if (card && !this.isLocked && !this.flippedCards.includes(card)) {
                this.flipCard(card);
            }
        });
    }

    flipCard(card) {
        if (this.flippedCards.length < 2) {
            card.classList.add('flipped');
            this.flippedCards.push(card);

            if (!this.timerInterval) {
                this.startTimer();
            }

            if (this.flippedCards.length === 2) {
                this.moves++;
                this.moveCount.textContent = this.moves;
                this.checkMatch();
            }
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        const match = first.dataset.id === second.dataset.id;

        this.isLocked = true;
        setTimeout(() => {
            if (match) {
                this.handleMatch(first, second);
            } else {
                this.handleMismatch(first, second);
            }
            this.flippedCards = [];
            this.isLocked = false;
        }, 1000);
    }

    handleMatch(first, second) {
        first.classList.add('matched');
        second.classList.add('matched');
        this.matchedPairs++;

        if (this.matchedPairs === this.memories.length) {
            this.endGame();
        }
    }

    handleMismatch(first, second) {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.gameTime++;
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = this.gameTime % 60;
            this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        setTimeout(() => {
            this.showCongratulations();
        }, 500);
    }

    showCongratulations() {
        const modal = document.createElement('div');
        modal.className = 'congratulations-modal glass-effect';
        modal.innerHTML = `
            <h2>Congratulations! 🎉</h2>
            <p>You completed the game in ${this.moves} moves</p>
            <p>Time: ${this.timer.textContent}</p>
            <button class="play-again-btn">Play Again</button>
        `;

        document.body.appendChild(modal);
        modal.querySelector('.play-again-btn').addEventListener('click', () => {
            modal.remove();
            this.resetGame();
        });
    }

    resetGame() {
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.flippedCards = [];
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.moveCount.textContent = '0';
        this.timer.textContent = '00:00';
        this.createCards();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

window.APP.initializeMemoryGame = function() {
    const game = new window.APP.MemoryGame();
    game.initialize();
    return game;
};