document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container-valentine');
    const card = document.querySelector('.card');
    let isFlipped = false;

    // Animation when hovering
    container.addEventListener('mouseenter', function() {
        if (!isFlipped) {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'translateY(-90px)';
        }
    });

    container.addEventListener('mouseleave', function() {
        if (!isFlipped) {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'translateY(0)';
        }
    });

    // Click to show message
    container.addEventListener('click', function() {
        isFlipped = !isFlipped;
        if (isFlipped) {
            card.style.transform = 'rotateY(180deg) translateY(-90px)';
            card.innerHTML = `
                <div class="card-message" style="transform: rotateY(180deg);">
                    <h3 >
                    ความทรงจำไม่มาก แต่รักมาก :)</h3>
                    <p>Current Date: ${new Date().toLocaleDateString()}</p>
                    <p>Dear P Fuse ❤️</p>
                </div>
            `;
        } else {
            card.style.transform = 'rotateY(0) translateY(0)';
            card.innerHTML = `
                <div class="text">Happy<br> Valentine's<br> Day!</div>
                <div class="heart"></div>
            `;
        }
    });
});