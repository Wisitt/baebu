window.APP = window.APP || {};

window.APP.MusicPlayer = class {
    constructor() {
        // Initialize elements
        this.audio = document.getElementById('bgMusic');
        this.toggleBtn = document.getElementById('musicToggle');
        this.prevBtn = document.getElementById('prevTrack');
        this.nextBtn = document.getElementById('nextTrack');
        this.progressBar = document.querySelector('.progress');
        this.songTitle = document.getElementById('songTitle');
        
        // Playlist configuration
        this.playlist = [
            { 
                title: 'Freelove', 
                src: 'assets/audio/Freelove.mp3'
            },
            { 
                title: 'Smile', 
                src: 'assets/audio/Smile.mp3'
            }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;

        // Bind methods to maintain context
        this.togglePlay = this.togglePlay.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.handlePlayError = this.handlePlayError.bind(this);
    }

    initialize() {
        // Load initial track
        this.loadTrack(this.currentTrack);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Player controls
        this.toggleBtn.addEventListener('click', this.togglePlay);
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());

        // Audio events
        this.audio.addEventListener('timeupdate', this.updateProgress);
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('error', this.handlePlayError);

        // Add play promise handling
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.toggleBtn.textContent = '⏸';
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.toggleBtn.textContent = '▶';
        });
    }

    loadTrack(index) {
        try {
            const track = this.playlist[index];
            this.audio.src = track.src;
            this.songTitle.textContent = track.title;
            this.audio.load(); // Explicitly load the audio
        } catch (error) {
            console.error('Error loading track:', error);
        }
    }

    togglePlay() {
        if (this.audio.paused) {
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Playback started successfully
                        this.isPlaying = true;
                        this.toggleBtn.textContent = '⏸';
                    })
                    .catch(error => {
                        // Auto-play was prevented
                        console.error('Playback failed:', error);
                        this.isPlaying = false;
                        this.toggleBtn.textContent = '▶';
                    });
            }
        } else {
            this.audio.pause();
            this.isPlaying = false;
            this.toggleBtn.textContent = '▶';
        }
    }

    playPrevious() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.togglePlay();
        }
    }

    playNext() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.togglePlay();
        }
    }

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    handlePlayError(error) {
        console.error('Audio playback error:', error);
        this.isPlaying = false;
        this.toggleBtn.textContent = '▶';
    }
};

// Initialize the music player when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.APP.musicPlayer = new window.APP.MusicPlayer();
    window.APP.musicPlayer.initialize();
});