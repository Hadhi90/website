/* ============================================
   SCREEN NAVIGATION
   ============================================ */
function nextScreen(currentScreen) {
  // Hide current screen with fade out
  const current = document.getElementById(`screen${currentScreen}`);
  current.style.animation = 'fadeOut 0.5s ease';
  
  setTimeout(() => {
    current.classList.add('hidden');
    
    // Show next screen
    const next = document.getElementById(`screen${currentScreen + 1}`);
    next.classList.remove('hidden');
    next.style.animation = 'fadeInUp 0.8s ease';
  }, 500);
}

/* ============================================
   RUNAWAY NO BUTTON
   ============================================ */
const noBtn = document.getElementById('noBtn');

if (noBtn) {
  // Mouse hover - button runs away
  noBtn.addEventListener('mouseover', moveNoButton);
  
  // Touch devices - button runs away
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  function moveNoButton() {
    const card = document.querySelector('#screen4');
    const cardRect = card.getBoundingClientRect();
    
    // Calculate random position within the card bounds
    const maxX = cardRect.width - noBtn.offsetWidth - 40;
    const maxY = cardRect.height - noBtn.offsetHeight - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Optional: Make it shrink slightly each time
    const currentScale = parseFloat(noBtn.style.transform?.replace('scale(', '')?.replace(')', '') || '1');
    if (currentScale > 0.5) {
      noBtn.style.transform = `scale(${currentScale - 0.1})`;
    }
  }
}

/* ============================================
   YES BUTTON - CONFETTI & VIDEO
   ============================================ */
function sayYes() {
  // Launch confetti
  launchConfetti();
  
  // Wait a moment for confetti to start
  setTimeout(() => {
    openVideoWindow();
  }, 500);
}

/* ============================================
   CONFETTI ANIMATION
   ============================================ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const confettiPieces = [];
  const confettiCount = 150;
  const colors = ['#e91e63', '#f06292', '#ff4081', '#ff80ab', '#ffc0cb', '#ffb3d9'];
  
  // Create confetti pieces
  class Confetti {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 8 + 5;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = Math.random() * 2 - 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      
      // Reset if out of bounds
      if (this.y > canvas.height) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }
  
  // Initialize confetti
  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push(new Confetti());
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces.forEach((confetti) => {
      confetti.update();
      confetti.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Stop confetti after 10 seconds
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 10000);
}

/* ============================================
   VIDEO WINDOW
   ============================================ */
function openVideoWindow() {
  // Open new window
  const videoWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Create the video page content
  videoWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>I Love You ❤️</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          overflow: hidden;
        }
        
        .container {
          text-align: center;
          padding: 20px;
          max-width: 900px;
          width: 90%;
        }
        
        .message {
          color: #ff80ab;
          font-size: 2rem;
          margin-bottom: 30px;
          animation: fadeIn 2s ease;
        }
        
        video {
          width: 100%;
          max-width: 800px;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(255, 128, 171, 0.3);
          animation: fadeInScale 1.5s ease;
        }
        
        .footer-message {
          color: #ffc0cb;
          font-size: 1.5rem;
          margin-top: 30px;
          font-style: italic;
          animation: fadeIn 3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .message {
            font-size: 1.5rem;
          }
          .footer-message {
            font-size: 1.2rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="message">I knew you'd say yes ❤️</div>
        
        <video controls autoplay>
          <source src="video/valentine.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        
        <div class="footer-message">Distance or not… you're my Valentine forever 💕</div>
      </div>
    </body>
    </html>
  `);
  
  videoWindow.document.close();
}

/* ============================================
   FADE OUT ANIMATION (for CSS)
   ============================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;
document.head.appendChild(style);

/* ============================================
   WINDOW RESIZE HANDLER
   ============================================ */
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});