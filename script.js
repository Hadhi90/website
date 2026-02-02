/* ============================================
   SCREEN NAVIGATION
   ============================================ */
function nextScreen(currentScreen) {
  // Hide current screen with fade out
  const current = document.getElementById(`screen${currentScreen}`);
  current.style.animation = 'fadeOut 0.6s ease';
  
  setTimeout(() => {
    current.classList.add('hidden');
    
    // Show next screen
    const next = document.getElementById(`screen${currentScreen + 1}`);
    next.classList.remove('hidden');
    next.style.animation = 'fadeInUp 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }, 600);
}

/* ============================================
   RUNAWAY NO BUTTON
   ============================================ */
const noBtn = document.getElementById('noBtn');

if (noBtn) {
  let escapeCount = 0;
  
  // Mouse hover - button runs away
  noBtn.addEventListener('mouseover', moveNoButton);
  
  // Touch devices - button runs away
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  function moveNoButton() {
    escapeCount++;
    const card = document.querySelector('#screen4');
    const cardRect = card.getBoundingClientRect();
    
    // Calculate random position within the card bounds
    const maxX = cardRect.width - noBtn.offsetWidth - 60;
    const maxY = cardRect.height - noBtn.offsetHeight - 60;
    
    const randomX = Math.random() * maxX + 30;
    const randomY = Math.random() * maxY + 30;
    
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Make it shrink and fade slightly each time
    const currentScale = parseFloat(noBtn.style.transform?.replace('scale(', '')?.replace(')', '') || '1');
    if (currentScale > 0.3) {
      noBtn.style.transform = `scale(${currentScale - 0.08})`;
      noBtn.style.opacity = Math.max(0.4, 1 - (escapeCount * 0.05));
    }
    
    // Add a wiggle animation
    noBtn.style.animation = 'wiggle 0.3s ease';
    setTimeout(() => {
      noBtn.style.animation = '';
    }, 300);
    
    // Change button text after a few escapes
    if (escapeCount === 5) {
      noBtn.textContent = "Pretty please? 🥺";
    } else if (escapeCount === 10) {
      noBtn.textContent = "You sure? 😢";
    } else if (escapeCount === 15) {
      noBtn.textContent = "Really? 💔";
    }
  }
}

/* ============================================
   YES BUTTON - CONFETTI & VIDEO
   ============================================ */
function sayYes() {
  // Add a celebratory scale animation to the yes button
  const yesBtn = document.querySelector('.yes-btn');
  yesBtn.style.animation = 'celebrate 0.5s ease';
  
  // Launch confetti
  launchConfetti();
  
  // Wait a moment for confetti to start
  setTimeout(() => {
    openVideoWindow();
  }, 800);
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
  const confettiCount = 200;
  const colors = [
    '#E91E63', '#F06292', '#FF4081', '#FF80AB', 
    '#FFC0CB', '#FFB3D9', '#FF6B9D', '#FEC5E5',
    '#FFD700', '#FFA500', '#FF69B4'
  ];
  
  // Confetti shapes
  const shapes = ['circle', 'square', 'triangle', 'heart'];
  
  // Create confetti pieces
  class Confetti {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 10 + 6;
      this.speedY = Math.random() * 4 + 3;
      this.speedX = Math.random() * 3 - 1.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 15 - 7.5;
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.opacity = 1;
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      
      // Add gravity effect
      this.speedY += 0.1;
      
      // Reset if out of bounds
      if (this.y > canvas.height + 10) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
        this.speedY = Math.random() * 4 + 3;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      
      switch(this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'heart':
          // Simple heart shape
          ctx.font = `${this.size}px Arial`;
          ctx.fillText('❤️', -this.size / 2, this.size / 2);
          break;
      }
      
      ctx.restore();
    }
  }
  
  // Initialize confetti
  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push(new Confetti());
  }
  
  // Animation loop
  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces.forEach((confetti) => {
      confetti.update();
      confetti.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animate();
  
  // Stop confetti after 12 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 12000);
}

/* ============================================
   VIDEO WINDOW
   ============================================ */
function openVideoWindow() {
  // Open new window
  const videoWindow = window.open('', '_blank', 'width=900,height=700');
  
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
          background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: 'Georgia', 'Segoe UI', serif;
          overflow: hidden;
          position: relative;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Floating hearts in background */
        .hearts-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        
        .heart-float {
          position: absolute;
          font-size: 2rem;
          opacity: 0.2;
          animation: floatHeart 15s infinite;
        }
        
        .heart-float:nth-child(1) { left: 10%; animation-delay: 0s; }
        .heart-float:nth-child(2) { left: 30%; animation-delay: 3s; }
        .heart-float:nth-child(3) { left: 50%; animation-delay: 6s; }
        .heart-float:nth-child(4) { left: 70%; animation-delay: 2s; }
        .heart-float:nth-child(5) { left: 85%; animation-delay: 4s; }
        
        @keyframes floatHeart {
          0% {
            bottom: -10%;
            transform: translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% {
            bottom: 110%;
            transform: translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .container {
          text-align: center;
          padding: 30px;
          max-width: 950px;
          width: 90%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }
        
        .message {
          color: #FF80AB;
          font-size: 2.5rem;
          margin-bottom: 40px;
          animation: fadeIn 2s ease, textGlow 3s ease-in-out infinite;
          text-shadow: 0 0 20px rgba(255, 128, 171, 0.5);
          font-weight: 600;
          letter-spacing: 1px;
        }
        
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 128, 171, 0.5);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(255, 128, 171, 0.8),
              0 0 40px rgba(255, 105, 180, 0.6);
          }
        }
        
        .video-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 
            0 25px 70px rgba(255, 128, 171, 0.4),
            0 10px 30px rgba(0, 0, 0, 0.5);
          animation: fadeInScale 1.8s ease;
        }
        
        video {
          width: 100%;
          max-width: 850px;
          display: block;
          border-radius: 20px;
        }
        
        .footer-message {
          color: #FFC0CB;
          font-size: 1.8rem;
          margin-top: 40px;
          font-style: italic;
          animation: fadeIn 3.5s ease;
          text-shadow: 0 0 15px rgba(255, 192, 203, 0.4);
          line-height: 1.6;
        }
        
        .footer-message::before,
        .footer-message::after {
          content: '✨';
          margin: 0 15px;
          font-size: 1.5rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .message {
            font-size: 1.8rem;
            margin-bottom: 30px;
          }
          .footer-message {
            font-size: 1.3rem;
            margin-top: 30px;
          }
          .container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="hearts-bg">
        <div class="heart-float">💖</div>
        <div class="heart-float">❤️</div>
        <div class="heart-float">💕</div>
        <div class="heart-float">💗</div>
        <div class="heart-float">💝</div>
      </div>
      
      <div class="container">
        <div class="message">I knew you'd say yes ❤️</div>
        
        <div class="video-wrapper">
          <video controls autoplay>
            <source src="video/valentine.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div class="footer-message">You're my Valentine forever 💕</div>
      </div>
    </body>
    </html>
  `);
  
  videoWindow.document.close();
}

/* ============================================
   ANIMATIONS - KEYFRAMES
   ============================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-40px) scale(0.95);
    }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
  
  @keyframes celebrate {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.2) rotate(-5deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    75% { transform: scale(1.15) rotate(-3deg); }
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

/* ============================================
   MOUSE TRAIL EFFECT (OPTIONAL ENHANCEMENT)
   ============================================ */
let mouseTrailEnabled = true;
const trails = [];

document.addEventListener('mousemove', (e) => {
  if (!mouseTrailEnabled || trails.length > 15) return;
  
  const trail = document.createElement('div');
  trail.className = 'mouse-trail';
  trail.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, #FF80AB, transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    animation: trailFade 1s ease-out forwards;
  `;
  
  document.body.appendChild(trail);
  trails.push(trail);
  
  setTimeout(() => {
    trail.remove();
    trails.shift();
  }, 1000);
});

// Add trail fade animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
  @keyframes trailFade {
    from {
      opacity: 0.6;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.3);
    }
  }
`;
document.head.appendChild(trailStyle);
