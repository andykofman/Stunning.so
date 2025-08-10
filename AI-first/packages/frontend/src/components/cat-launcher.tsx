"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
// Use public path directly to avoid module resolution issues
import { AnimatedCat } from './animated-cat';

export function CatLauncher() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [spawnPoints, setSpawnPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [deadline, setDeadline] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<{ position: { x: number; y: number }; distanceToExit: number; exiting: boolean } | null>(null);

  // Compute button position (bottom-right)
  const buttonSize = 72;
  const buttonPadding = 20;
  const buttonPos = {
    x: typeof window !== 'undefined' ? window.innerWidth - buttonSize - buttonPadding : 0,
    y: typeof window !== 'undefined' ? window.innerHeight - buttonSize - buttonPadding : 0,
  };

  const start = () => {
    setMounted(true);
    setActive(true);
    setSpawnPoints([{ x: buttonPos.x, y: buttonPos.y }]);
    const until = Date.now() + 30_000;
    setDeadline(until);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setActive(false), 30_000);
  };

  const stop = () => {
    // Flip active; AnimatedCat will run back to the base and call onExited.
    setActive(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setDeadline(null);
  };

  // Keep button position responsive
  useEffect(() => {
    const onResize = () => {
      // force rerender by toggling state
      setSpawnPoints((arr) => [...arr]);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Cat instance */}
      {mounted &&
        spawnPoints.map((pt, idx) => (
          <AnimatedCat
            key={`cat-${idx}`}
            active={active}
            spawnAt={pt}
            exitTarget={buttonPos}
            onStatusChange={idx === 0 ? setStatus : undefined}
            onCloneRequest={(p: { x: number; y: number }) => setSpawnPoints((arr) => [...arr, p])}
            onExited={() => {
              // Wait for all to request exit; when active=false, each will explode and call onExited.
              // After the last one finishes, reset mounted/state.
              // We detect last by deferring reset until no cats remain (active already false).
              setTimeout(() => {
                if (!active) {
                  setSpawnPoints([]);
                  setDeadline(null);
                  setMounted(false);
                  setActive(false);
                }
              }, 50);
            }}
          />
        ))}

      {/* Floating action button */}
      <button
        aria-label={active ? 'Hide cat' : 'Release cat'}
        onClick={active ? stop : start}
        className="fixed bottom-5 right-5 z-40 grid place-items-center p-0 transition hover:scale-105"
        style={{ width: buttonSize, height: buttonSize }}
      >
        {active ? (
          <span className="text-2xl font-bold text-white">×</span>
        ) : (
          <span className="inline-block animate-spin-slow rounded-full overflow-hidden" style={{ width: buttonSize, height: buttonSize }}>
            <Image src="/stunning-animated.gif" alt="stunning" width={buttonSize} height={buttonSize} />
          </span>
        )}
      </button>
      {/* Debug aid (toggle if needed): position and distance */}
      {/* <pre className="fixed bottom-24 right-5 text-xs text-white/70">{JSON.stringify(status, null, 2)}</pre> */}
    </>
  );
}


