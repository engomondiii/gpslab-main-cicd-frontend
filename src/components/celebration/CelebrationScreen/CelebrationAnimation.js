/**
 * GPS Lab Platform - CelebrationAnimation Component
 * 
 * Core animation component for celebrations with confetti,
 * particles, sparkles, and customizable effects.
 * Integrates with the Baraka/PSB economy and badge systems.
 * 
 * @module components/celebration/CelebrationScreen/CelebrationAnimation
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CelebrationAnimation.css';

/**
 * Particle types for different celebrations
 */
const PARTICLE_TYPES = {
  confetti: {
    shapes: ['square', 'rectangle', 'circle'],
    colors: ['#00d4ff', '#8e44ad', '#f1c40f', '#2ecc71', '#e74c3c', '#ff6b9d'],
    count: 150,
    gravity: 0.3,
    spread: 180
  },
  sparkle: {
    shapes: ['star'],
    colors: ['#f1c40f', '#ffffff', '#00d4ff'],
    count: 50,
    gravity: 0.1,
    spread: 360
  },
  coins: {
    shapes: ['coin'],
    colors: ['#f1c40f', '#ffd700', '#ffb347'],
    count: 30,
    gravity: 0.5,
    spread: 120
  },
  hearts: {
    shapes: ['heart'],
    colors: ['#e74c3c', '#ff6b9d', '#8e44ad'],
    count: 40,
    gravity: 0.2,
    spread: 160
  },
  stars: {
    shapes: ['star'],
    colors: ['#00d4ff', '#8e44ad', '#f1c40f'],
    count: 60,
    gravity: 0.15,
    spread: 360
  }
};

/**
 * Celebration intensity presets
 */
const INTENSITY_PRESETS = {
  subtle: { multiplier: 0.5, duration: 2000 },
  normal: { multiplier: 1, duration: 3000 },
  epic: { multiplier: 1.5, duration: 4000 },
  legendary: { multiplier: 2, duration: 5000 }
};

/**
 * Generate a random particle
 */
const createParticle = (config, canvasWidth, canvasHeight, originX, originY) => {
  const angle = (Math.random() * config.spread - config.spread / 2) * (Math.PI / 180);
  const velocity = 8 + Math.random() * 12;
  const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
  const color = config.colors[Math.floor(Math.random() * config.colors.length)];
  
  return {
    x: originX ?? canvasWidth / 2,
    y: originY ?? canvasHeight / 2,
    vx: Math.cos(angle - Math.PI / 2) * velocity,
    vy: Math.sin(angle - Math.PI / 2) * velocity,
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    shape,
    color,
    opacity: 1,
    gravity: config.gravity,
    life: 1
  };
};

/**
 * CelebrationAnimation Component
 */
const CelebrationAnimation = ({
  type = 'confetti', // confetti, sparkle, coins, hearts, stars
  intensity = 'normal', // subtle, normal, epic, legendary
  isActive = false,
  onComplete,
  originX,
  originY,
  autoStart = true,
  loop = false,
  soundEnabled = true,
  className = '',
  ...props
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get configuration
  const particleConfig = PARTICLE_TYPES[type] || PARTICLE_TYPES.confetti;
  const intensityConfig = INTENSITY_PRESETS[intensity] || INTENSITY_PRESETS.normal;
  
  // Draw particle based on shape
  const drawParticle = useCallback((ctx, particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    
    const size = particle.size;
    
    switch (particle.shape) {
      case 'square':
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
        
      case 'rectangle':
        ctx.fillRect(-size / 2, -size / 4, size, size / 2);
        break;
        
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'star':
        drawStar(ctx, 0, 0, 5, size / 2, size / 4);
        break;
        
      case 'coin':
        // Draw coin with Baraka symbol style
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Inner detail
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-size / 6, -size / 6, size / 6, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'heart':
        drawHeart(ctx, 0, 0, size);
        break;
        
      default:
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }
    
    ctx.restore();
  }, []);
  
  // Draw star shape
  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };
  
  // Draw heart shape
  const drawHeart = (ctx, x, y, size) => {
    const topCurveHeight = size * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y + topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      x - size / 2, y - topCurveHeight,
      x - size, y + topCurveHeight,
      x, y + size / 2
    );
    // Right curve
    ctx.bezierCurveTo(
      x + size, y + topCurveHeight,
      x + size / 2, y - topCurveHeight,
      x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
  };
  
  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Update physics
      particle.vy += particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;
      particle.life -= 0.01;
      particle.opacity = Math.max(0, particle.life);
      
      // Draw if still alive
      if (particle.life > 0 && particle.y < height + 50) {
        drawParticle(ctx, particle);
        return true;
      }
      return false;
    });
    
    // Continue animation or complete
    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      if (loop && isActive) {
        startAnimation();
      } else if (onComplete) {
        onComplete();
      }
    }
  }, [drawParticle, loop, isActive, onComplete]);
  
  // Start animation
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { width, height } = canvas;
    const count = Math.floor(particleConfig.count * intensityConfig.multiplier);
    
    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(
        createParticle(particleConfig, width, height, originX, originY)
      );
    }
    
    setIsAnimating(true);
    animationRef.current = requestAnimationFrame(animate);
    
    // Play sound if enabled
    if (soundEnabled) {
      playCelebrationSound(type, intensity);
    }
  }, [particleConfig, intensityConfig, originX, originY, animate, soundEnabled, type, intensity]);
  
  // Play celebration sound
  const playCelebrationSound = (celebrationType, celebrationIntensity) => {
    // In production, this would play actual sounds
    // For now, we'll use the Web Audio API for simple tones
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different celebration types
      const frequencies = {
        confetti: [523, 659, 784],
        sparkle: [880, 1047, 1319],
        coins: [440, 554, 659],
        hearts: [392, 494, 587],
        stars: [659, 784, 988]
      };
      
      const freqs = frequencies[celebrationType] || frequencies.confetti;
      
      freqs.forEach((freq, i) => {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.1, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          osc.start(audioContext.currentTime);
          osc.stop(audioContext.currentTime + 0.3);
        }, i * 100);
      });
    } catch (e) {
      // Audio not supported or blocked
    }
  };
  
  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);
  
  // Start/stop animation based on isActive
  useEffect(() => {
    if (isActive && autoStart && !isAnimating) {
      startAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, autoStart, isAnimating, startAnimation]);
  
  const classNames = [
    'celebration-animation',
    isAnimating && 'celebration-animation--active',
    `celebration-animation--${type}`,
    `celebration-animation--${intensity}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <canvas
        ref={canvasRef}
        className="celebration-animation__canvas"
      />
    </div>
  );
};

export { PARTICLE_TYPES, INTENSITY_PRESETS };
export default CelebrationAnimation;