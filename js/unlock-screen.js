window.APP = window.APP || {};

window.APP.PuzzleUnlock = class {
    constructor() {
        this.container = document.getElementById('puzzleScreen');
        this.board = document.querySelector('.puzzle-board');
        this.moveCount = document.getElementById('moveCount');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.mainContent = document.getElementById('mainContent');

        this.moves = 0;
        this.pieces = [];
        this.currentPiece = null;
        this.correctPositions = 0;
        this.totalPieces = 9;
        
        // เก็บข้อมูลตำแหน่งที่ถูกต้อง
        this.correctPlacements = new Set();
        this.startPositions = Array.from({ length: this.totalPieces }, (_, i) => i);

        this.initialize();
        this.isCompleted = false;
    }

    initialize() {
        this.createPuzzlePieces();
        this.setupDragAndDrop();
    }

    createPuzzlePieces() {
        // สร้าง grid container
        this.board.style.display = 'grid';
        this.board.style.gridTemplateColumns = 'repeat(3, 1fr)';
        this.board.style.gap = '4px';

        const pieces = Array.from({ length: this.totalPieces }, (_, i) => i);
        this.shuffledPieces = this.shuffle([...pieces]);

        this.shuffledPieces.forEach((index) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.index = index;

            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-wrapper';

            const img = document.createElement('img');
            img.src = `assets/images/puzzle/heart-${index + 1}.jpg`;
            img.alt = `Puzzle piece ${index + 1}`;
            img.draggable = false; // ป้องกันการลากรูปภาพ
            img.onload = () => {
                imageWrapper.style.opacity = '1';
            };
    
            // const number = document.createElement('span');
            // number.className = 'piece-number';
            // number.textContent = index + 1;

            piece.appendChild(img);
            piece.appendChild(imageWrapper);
            // piece.appendChild(number);
            this.board.appendChild(piece);
            this.pieces.push(piece);
        });
    }

    setupDragAndDrop() {
        let draggedPiece = null;
        let startX, startY;
        let initialX, initialY;

        const touchSensitivity = 30; // ระยะห่างขั้นต่ำในการสลับชิ้นส่วน

        // -----------------------
        // Touch Event Listeners
        // -----------------------
        this.pieces.forEach(piece => {
            piece.addEventListener('touchstart', (e) => {
                if (this.correctPlacements.has(parseInt(piece.dataset.index))) return;
    
                const touch = e.touches[0];
                draggedPiece = piece;
                startX = touch.clientX;
                startY = touch.clientY;
    
                const rect = piece.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
    
                piece.style.zIndex = '1000';
                piece.classList.add('dragging');
    
                // สร้าง placeholder
                const placeholder = piece.cloneNode(true);
                placeholder.classList.add('placeholder');
                placeholder.style.opacity = '0.3';
                piece.placeholder = placeholder;
    
                e.preventDefault();
            }, { passive: false });
    
            piece.addEventListener('touchmove', (e) => {
                if (!draggedPiece) return;
    
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
    
                // เคลื่อนที่แบบ smooth
                draggedPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    
                // หาชิ้นส่วนที่ใกล้ที่สุด
                const pieces = Array.from(this.board.children);
                let closestPiece = null;
                let minDistance = Infinity;
    
                pieces.forEach(otherPiece => {
                    if (otherPiece !== draggedPiece && 
                        !this.correctPlacements.has(parseInt(otherPiece.dataset.index))) {
                        const rect = otherPiece.getBoundingClientRect();
                        const distance = Math.hypot(
                            touch.clientX - (rect.left + rect.width / 2),
                            touch.clientY - (rect.top + rect.height / 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestPiece = otherPiece;
                        }
                    }
                });
    
                // แสดง visual feedback
                pieces.forEach(p => p.classList.remove('hover'));
                if (closestPiece && minDistance < touchSensitivity) {
                    closestPiece.classList.add('hover');
                }
    
                e.preventDefault();
            }, { passive: false });
    
            piece.addEventListener('touchend', (e) => {
                if (!draggedPiece) return;
    
                const pieces = Array.from(this.board.children);
                const closestPiece = pieces.find(p => p.classList.contains('hover'));
    
                if (closestPiece) {
                    this.swapPieces(draggedPiece, closestPiece);
                    this.moves++;
                    this.moveCount.textContent = this.moves;
                }
    
                // Reset styles
                draggedPiece.style.transform = '';
                draggedPiece.style.zIndex = '';
                draggedPiece.classList.remove('dragging');
                pieces.forEach(p => p.classList.remove('hover'));
    
                draggedPiece = null;
                e.preventDefault();
                
                this.checkAllPositions();
            }, { passive: false });
        });

        // -----------------------
        // Mouse Event Listeners
        // -----------------------
        this.pieces.forEach(piece => {
            let isMouseDown = false;
            let originalX = 0;
            let originalY = 0;

            piece.addEventListener('mousedown', (e) => {
                if (this.correctPlacements.has(parseInt(piece.dataset.index))) return;

                isMouseDown = true;
                draggedPiece = piece;
                startX = e.clientX;
                startY = e.clientY;

                const rect = piece.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                originalX = piece.offsetLeft;
                originalY = piece.offsetTop;

                piece.style.zIndex = '1000';
                piece.classList.add('dragging');

                e.preventDefault();
            });

            piece.addEventListener('mousemove', (e) => {
                if (!isMouseDown || !draggedPiece) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                draggedPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

                const pieces = Array.from(this.board.children);
                let closestPiece = null;
                let minDistance = Infinity;

                pieces.forEach(otherPiece => {
                    if (otherPiece !== draggedPiece &&
                        !this.correctPlacements.has(parseInt(otherPiece.dataset.index))) {
                        const rect = otherPiece.getBoundingClientRect();
                        const distance = Math.hypot(
                            e.clientX - (rect.left + rect.width / 2),
                            e.clientY - (rect.top + rect.height / 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestPiece = otherPiece;
                        }
                    }
                });

                pieces.forEach(p => p.classList.remove('hover'));
                if (closestPiece && minDistance < 40) {
                    // กำหนดระยะ 40 ดูว่าใกล้พอจะสลับหรือไม่
                    closestPiece.classList.add('hover');
                }
            });

            piece.addEventListener('mouseup', (e) => {
                if (!isMouseDown || !draggedPiece) return;
                
                const pieces = Array.from(this.board.children);
                const closestPiece = pieces.find(p => p.classList.contains('hover'));

                if (closestPiece) {
                    this.swapPieces(draggedPiece, closestPiece);
                    this.moves++;
                    this.moveCount.textContent = this.moves;
                }

                draggedPiece.style.transform = '';
                draggedPiece.style.zIndex = '';
                draggedPiece.classList.remove('dragging');
                pieces.forEach(p => p.classList.remove('hover'));

                isMouseDown = false;
                draggedPiece = null;

                e.preventDefault();
                this.checkAllPositions();
            });

            // ยกเลิก drag หากเมาส์ออกจากชิ้นส่วน
            piece.addEventListener('mouseleave', () => {
                if (!isMouseDown || !draggedPiece) return;

                draggedPiece.style.transform = '';
                draggedPiece.style.zIndex = '';
                draggedPiece.classList.remove('dragging');

                isMouseDown = false;
                draggedPiece = null;
            });
        });

        // Add touch-specific styles
        const touchStyles = `
            .puzzle-piece {
                touch-action: none;
                -webkit-touch-callout: none;
            }
            .puzzle-piece.hover {
                transform: scale(0.95);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            .puzzle-piece.dragging {
                transition: transform 0.1s ease;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = touchStyles;
        document.head.appendChild(styleSheet);
    }

    checkAllPositions() {
        let allCorrect = true;
        const boardChildren = Array.from(this.board.children);
        
        boardChildren.forEach((piece, currentIndex) => {
            const pieceIndex = parseInt(piece.dataset.index);
            const isCorrect = pieceIndex === currentIndex;
            
            if (isCorrect) {
                if (!piece.classList.contains('correct')) {
                    piece.classList.add('correct');
                    this.correctPlacements.add(pieceIndex);
                    this.showSuccess(piece);
                }
            } else {
                piece.classList.remove('correct');
                this.correctPlacements.delete(pieceIndex);
                allCorrect = false;
            }
        });
    
        this.correctPositions = this.correctPlacements.size;
        const progress = (this.correctPositions / this.totalPieces) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = 
            `${Math.round(progress)}% Complete (${this.correctPositions}/${this.totalPieces})`;
    
            if (allCorrect && !this.isCompleted) { // เช็คสถานะก่อนเรียก handleCompletion
                this.handleCompletion();
            }
    }

    swapPieces(piece1, piece2) {
        if (this.correctPlacements.has(parseInt(piece1.dataset.index)) || 
            this.correctPlacements.has(parseInt(piece2.dataset.index))) {
            return;
        }
    
        const board = piece1.parentNode;
        const allPieces = Array.from(board.children);

        const placeholder = document.createElement('div');
        placeholder.className = 'puzzle-placeholder';
        board.replaceChild(placeholder, piece1);
        board.replaceChild(piece1, piece2);
        board.replaceChild(piece2, placeholder);
    
        this.moves++;
        this.moveCount.textContent = this.moves;

        this.pieces.forEach(piece => this.checkPiecePosition(piece));
        this.checkProgress();
    }

    checkPiecePosition(piece) {
        if (this.isCompleted) return;
        const index = parseInt(piece.dataset.index);
        const currentIndex = Array.from(this.board.children).indexOf(piece);

        if (index === currentIndex) {
            piece.classList.add('correct');
            this.correctPlacements.add(index);
            this.showSuccess(piece);
        } else {
            piece.classList.remove('correct');
            this.correctPlacements.delete(index);
        }
    }

    showSuccess(piece) {
        const flash = document.createElement('div');
        flash.className = 'success-flash';
        piece.appendChild(flash);
        setTimeout(() => flash.remove(), 1000);
    }

    checkProgress() {
        if (this.isCompleted) return;

        this.correctPositions = Array.from(this.pieces).filter((piece, index) => {
            const pieceIndex = parseInt(piece.dataset.index);
            const currentIndex = Array.from(this.board.children).indexOf(piece);
            return pieceIndex === currentIndex;
        }).length;

        const progress = (this.correctPositions / this.totalPieces) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = 
            `${Math.round(progress)}% Complete (${this.correctPositions}/${this.totalPieces})`;

        if (this.correctPositions === this.totalPieces) {
            this.handleCompletion();
        }
    }

    handleCompletion() {
        if (this.isCompleted) return; // ตรวจสอบว่าเคยทำงานแล้วหรือไม่
        this.isCompleted = true; 

        this.board.classList.add('puzzle-complete');
        
        // ล็อคทุกชิ้นส่วน
        this.pieces.forEach(piece => {
            piece.draggable = false;
            piece.classList.add('completed');
        });
    
        // เพิ่มเอฟเฟกต์แสง
        gsap.to(this.board, {
            scale: 1.05,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    
        // เล่นเสียง
        try {
            const successAudio = new Audio('assets/audio/success.mp3');
            successAudio.play();
        } catch (err) {
            console.log('Audio playback failed');
        }
    
        // แสดงหน้าต่างสำเร็จ
        setTimeout(() => {
            const success = document.createElement('div');
            success.className = 'unlock-success';
            success.innerHTML = `
                <div class="success-content">
                    <h2>❤️ Perfect Match! ❤️</h2>
                    <p>Completed in ${this.moves} moves</p>
                    <button class="continue-btn">Enter Our Love Story</button>
                </div>
            `;
            document.body.appendChild(success);
    
            // Animation
            gsap.from(success.querySelector('.success-content'), {
                scale: 0.5,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
    
            // จัดการปุ่ม continue
            const continueBtn = success.querySelector('.continue-btn');
            continueBtn.addEventListener('click', () => {
                gsap.to([this.container, success], {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        document.body.classList.remove('locked');
                        this.container.remove();
                        success.remove();
                        this.mainContent.classList.remove('hidden');
                        window.APP.Main.initialize();
                    }
                });
            });
        }, 1000);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    new window.APP.PuzzleUnlock();
});