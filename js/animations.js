// animations.js

window.APP = window.APP || {};
window.APP.animations = {
    initialize() {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Header animations
        gsap.from('.header-content', {
            duration: 2,
            opacity: 0,
            y: 50,
            ease: 'power3.out'
        });

        // Scroll animations for sections
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                opacity: 0,
                y: 50,
                ease: 'power3.out'
            });
        });

        // Memory cards animation
        gsap.from('.memory-card', {
            scrollTrigger: {
                trigger: '.memories-section',
                start: 'top center'
            },
            duration: 1,
            opacity: 0,
            y: 50,
            stagger: 0.2
        });

        // Timeline animations
        gsap.from('.timeline-item', {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%'
            },
            duration: 1,
            opacity: 0,
            x: -50,
            stagger: 0.3
        });
    }
};