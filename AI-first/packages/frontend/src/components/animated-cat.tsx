"use client";
import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

export function AnimatedCat({
  active,
  spawnAt,
  exitTarget,
  onExited,
  onStatusChange,
  onCloneRequest,
}: {
  active: boolean;
  spawnAt?: Point;
  exitTarget?: Point;
  onExited?: () => void;
  onStatusChange?: (status: { position: Point; distanceToExit: number; exiting: boolean }) => void;
  onCloneRequest?: (spawnAt: Point) => void;
}) {
  const [catPosition, setCatPosition] = useState<Point>({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; id: number } | null>(null);
  const [direction, setDirection] = useState(-1); // -1 for left, 1 for right
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const clickIdRef = useRef(0);
  const velRef = useRef<Point>({ x: -80, y: 0 });
  const posRef = useRef<Point>({ x: 0, y: 0 });
  const targetXRef = useRef<number | null>(null);
  const stepPhaseRef = useRef(0);
  const [explosion, setExplosion] = useState<{ id: number; x: number; y: number } | null>(null);
  const explosionIdRef = useRef(0);
  const clickSeriesRef = useRef(0);

  // Visual scale (1.5x bigger) and base SVG dimensions
  const BASE_SCALE = 1.5;
  const CAT_W = 100;
  const CAT_H = 80;
  const SCALED_W = CAT_W * BASE_SCALE; // 150
  const SCALED_H = CAT_H * BASE_SCALE; // 120

  const exitingRef = useRef(false);
  const [show, setShow] = useState(false);

  // Initialize or spawn
  useEffect(() => {
    const initial = spawnAt ?? { x: window.innerWidth - SCALED_W, y: window.innerHeight - SCALED_H };
    posRef.current = initial;
    velRef.current = { x: -80, y: 0 };
    setCatPosition(initial);
    targetXRef.current = Math.max(50, Math.min(window.innerWidth - SCALED_W, initial.x - 200));
    setShow(active);
    exitingRef.current = false;
  }, []);

  // React to active changes
  const prevActive = useRef(active);
  useEffect(() => {
    if (active && !prevActive.current) {
      // spawn
      const p = spawnAt ?? { x: window.innerWidth - SCALED_W, y: window.innerHeight - SCALED_H };
      posRef.current = p;
      velRef.current = { x: -80, y: 0 };
      setCatPosition(p);
      setShow(true);
      exitingRef.current = false;
    } else if (!active && prevActive.current) {
      // vanish immediately with an explosion at current position
      exitingRef.current = false;
      const origin = { x: posRef.current.x + SCALED_W / 2, y: posRef.current.y + SCALED_H / 2 };
      // stop motion and hide cat
      velRef.current = { x: 0, y: 0 };
      targetXRef.current = null;
      setShow(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // trigger explosion visual
      setExplosion({ id: ++explosionIdRef.current, x: origin.x, y: origin.y });
      // auto-clear explosion and then notify exit complete
      window.setTimeout(() => {
        setExplosion((e) => (e && e.id === explosionIdRef.current ? null : e));
        onExited?.();
      }, 900);
    }
    prevActive.current = active;
  }, [active, spawnAt, exitTarget]);

  // Natural cat movement animation
  useEffect(() => {
    const gravity = 2400; // px/s^2
    const maxSpeed = 260; // px/s
    const restitution = 0.15; // ground bounce
    const friction = 3.2; // ground drag

    const animate = (now: number) => {
      const last = lastTimeRef.current || now;
      let dt = (now - last) / 1000;
      if (dt > 0.05) dt = 0.05; // clamp to avoid big jumps
      lastTimeRef.current = now;

      const groundY = window.innerHeight - 120;
      const minX = 50;
      const maxX = window.innerWidth - 150;

      // Decide patrol target if needed
      if (targetXRef.current == null || Math.abs((targetXRef.current as number) - posRef.current.x) < 10) {
        targetXRef.current = Math.max(minX, Math.min(maxX, Math.random() * (maxX - minX) + minX));
      }

      // Physics integration
      const v = velRef.current;
      const p = posRef.current;

      // Gravity
      v.y += gravity * dt;

      // PD control towards target when on ground and not mid-air
      const onGround = p.y >= groundY - 0.5;
      const distX = (targetXRef.current as number) - p.x;
      const accelX = onGround ? Math.max(-800, Math.min(800, distX * 6 - v.x * 4)) : 0;
      v.x += accelX * dt;

      // Friction when not accelerating much
      if (onGround && Math.abs(accelX) < 20) {
        const drag = Math.exp(-friction * dt);
        v.x *= drag;
      }

      // Clamp horizontal speed
      v.x = Math.max(-maxSpeed, Math.min(maxSpeed, v.x));

      // Integrate position
      p.x += v.x * dt;
      p.y += v.y * dt;

      // Collide with ground
      if (p.y > groundY) {
        p.y = groundY;
        if (v.y > 0) {
          v.y = -v.y * restitution;
          if (Math.abs(v.y) < 60) v.y = 0;
        }
        if (isJumping && v.y === 0) setIsJumping(false);
      }

      // Walls
      if (p.x < minX) {
        p.x = minX;
        v.x = Math.abs(v.x) * 0.5;
        targetXRef.current = Math.max(minX, Math.min(maxX, p.x + 200 + Math.random() * 200));
      } else if (p.x > maxX) {
        p.x = maxX;
        v.x = -Math.abs(v.x) * 0.5;
        targetXRef.current = Math.max(minX, Math.min(maxX, p.x - 200 - Math.random() * 200));
      }

      // Direction by velocity
      if (v.x > 5 && direction !== 1) setDirection(1);
      else if (v.x < -5 && direction !== -1) setDirection(-1);

      // Step bob for subtle realism proportional to speed
      stepPhaseRef.current += Math.abs(v.x) * dt * 0.08;
      const bob = Math.sin(stepPhaseRef.current * Math.PI * 2) * Math.min(2, Math.abs(v.x) / maxSpeed * 2);

      // Commit render position
      const renderPos = { x: p.x, y: p.y + bob };
      setCatPosition(renderPos);

      // Report status (exact position and distance to base)
      if (onStatusChange) {
        const ex = exitTarget?.x ?? maxX;
        onStatusChange({ position: renderPos, distanceToExit: Math.abs(p.x - ex), exiting: Boolean(exitingRef.current) });
      }

      // Handle exit completion
      if (exitingRef.current) {
        const exitX = exitTarget?.x ?? window.innerWidth - 150;
        const nearX = Math.abs(p.x - exitX) < 10;
        const onGroundNow = p.y >= groundY - 0.5 && Math.abs(v.y) === 0;
        if (nearX && onGroundNow) {
          // finalize exit: stop motion, hide, and notify without scheduling another frame
          exitingRef.current = false;
          v.x = 0;
          v.y = 0;
          targetXRef.current = null;
          setShow(false);
          // cancel any pending animation frame for absolute certainty
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          onExited?.();
          return; // do not request next frame; we'll unmount shortly
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [direction, isJumping]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCatPosition((prev) => ({ ...prev, y: window.innerHeight - 120 }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCatClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isJumping) return;

    const clickX = event.clientX;
    const clickY = event.clientY;
    const effectId = ++clickIdRef.current;
    setClickEffect({ x: clickX, y: clickY, id: effectId });
    setTimeout(() => {
      setClickEffect((prev) => (prev?.id === effectId ? null : prev));
    }, 800);

    // Apply an impulse-based jump
    setIsJumping(true);
    const v = velRef.current;
    const forward = 140;
    v.y = -750; // upward impulse
    v.x += direction * forward; // forward impulse

    // Count clicks for cloning behavior
    clickSeriesRef.current += 1;
    if (clickSeriesRef.current >= 3) {
      clickSeriesRef.current = 0;
      // Request a clone at current position (slightly offset to avoid perfect overlap)
      const base = posRef.current;
      onCloneRequest?.({ x: base.x + (Math.random() * 20 - 10), y: base.y });
    }
  };

  const tilt = Math.max(-4, Math.min(4, (velRef.current.x / 260) * 4));
  // Render explosion only (if any) when hidden
  if (!show) {
    return (
      <>
        {explosion && <Explosion key={explosion.id} x={explosion.x} y={explosion.y} />}
      </>
    );
  }
  // Exit fade/scale derived strictly from horizontal distance to exit; no early full fade
  const groundY = typeof window !== 'undefined' ? window.innerHeight - 120 : 0;
  const exitX = exitTarget?.x ?? (typeof window !== 'undefined' ? window.innerWidth - 150 : 0);
  const dx = Math.abs(catPosition.x - exitX);
  const fadeRadius = 80; // px
  const minVisible = 0.25;
  const fadeT = Math.max(0, Math.min(1, (dx - 10) / fadeRadius)); // 1 far, 0 very near (<=10px)
  const opacity = exitingRef.current ? minVisible + (1 - minVisible) * fadeT : 1;
  const scale = exitingRef.current ? 0.9 + 0.1 * fadeT : 1;
  return (
    <>
      {/* Animated Cat */}
      <div
        className="fixed z-20 cursor-pointer transition-transform duration-100 hover:scale-110"
        style={{ left: `${catPosition.x}px`, top: `${catPosition.y}px`, transform: `scale(${scale}) scaleX(${direction}) rotate(${tilt}deg)`, opacity }}
        onClick={handleCatClick}
      >
        <div className="relative">
          <svg width="100" height="80" viewBox="0 0 100 80" className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
            <ellipse cx="50" cy="55" rx="25" ry="15" fill="#4a5568" stroke="#805ad5" strokeWidth="1" />
            <circle cx="50" cy="35" r="18" fill="#4a5568" stroke="#805ad5" strokeWidth="1" />
            <polygon points="38,22 42,12 46,22" fill="#4a5568" stroke="#805ad5" strokeWidth="1" />
            <polygon points="54,22 58,12 62,22" fill="#4a5568" stroke="#805ad5" strokeWidth="1" />
            <polygon points="40,20 42,15 44,20" fill="#805ad5" />
            <polygon points="56,20 58,15 60,20" fill="#805ad5" />
            <rect x="35" y="30" width="30" height="12" rx="6" fill="rgba(0,0,0,0.8)" stroke="#00d4ff" strokeWidth="2" />
            <circle cx="42" cy="36" r="6" fill="rgba(0,212,255,0.3)" stroke="#00d4ff" strokeWidth="1" />
            <circle cx="58" cy="36" r="6" fill="rgba(0,212,255,0.3)" stroke="#00d4ff" strokeWidth="1" />
            <polygon points="48,42 50,40 52,42" fill="#ff6b9d" />
            <path d="M 50 42 Q 47 45 44 43" stroke="#805ad5" strokeWidth="1" fill="none" />
            <path d="M 50 42 Q 53 45 56 43" stroke="#805ad5" strokeWidth="1" fill="none" />
            <line x1="30" y1="38" x2="35" y2="37" stroke="#805ad5" strokeWidth="1" />
            <line x1="30" y1="42" x2="35" y2="42" stroke="#805ad5" strokeWidth="1" />
            <line x1="65" y1="37" x2="70" y2="38" stroke="#805ad5" strokeWidth="1" />
            <line x1="65" y1="42" x2="70" y2="42" stroke="#805ad5" strokeWidth="1" />
            <path d="M 25 55 Q 15 45 20 35" stroke="#805ad5" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="40" y="65" width="4" height="10" fill="#4a5568" stroke="#805ad5" strokeWidth="1" />
            <rect x="56" y="65" width="4" height="10" fill="#4a5568" stroke="#805ad5" strokeWidth="1" />
            <ellipse cx="42" cy="77" rx="3" ry="2" fill="#805ad5" />
            <ellipse cx="58" cy="77" rx="3" ry="2" fill="#805ad5" />
          </svg>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl" />
        </div>
      </div>

      {/* Click effect halo */}
      {clickEffect && (
        <div className="pointer-events-none fixed z-30" style={{ left: `${clickEffect.x - 25}px`, top: `${clickEffect.y - 25}px` }}>
          <div className="h-12 w-12 animate-ping rounded-full border-2 border-cyan-400" />
          <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full border border-purple-400" />
          <div className="absolute inset-2 h-8 w-8 animate-spin rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-400/30" />
        </div>
      )}

      {/* (Neon grid overlay removed) */}
      {/* Explosion overlay (if any) */}
      {explosion && <Explosion key={explosion.id} x={explosion.x} y={explosion.y} />}
    </>
  );
}


function Explosion({ x, y }: { x: number; y: number }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  const count = 24;
  const particles = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 40 + Math.random() * 90; // throw distance
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    const size = 3 + Math.random() * 3;
    const colors = ['#ff3fd4', '#9b5cff', '#00e0ff'];
    const bg = colors[i % colors.length];
    const delay = Math.random() * 80; // ms
    return { dx, dy, size, bg, delay };
  });

  return (
    <div className="pointer-events-none fixed z-30" style={{ left: x, top: y }}>
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {particles.map((p, idx) => (
          <span
            key={idx}
            className="absolute rounded-full shadow-glow"
            style={{
              width: p.size,
              height: p.size,
              background: p.bg,
              transform: armed ? `translate(${p.dx}px, ${p.dy}px) scale(0.6)` : 'translate(0,0) scale(1)',
              opacity: armed ? 0 : 1,
              transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${p.delay}ms, opacity 700ms ease-out ${p.delay}ms`,
              filter: 'drop-shadow(0 0 12px rgba(155,92,255,0.6))',
            }}
          />
        ))}
      </div>
    </div>
  );
}


