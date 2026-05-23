import { useEffect } from "react";
import type { Direction } from "./types";

const MIN_DISTANCE = 30;

export const useSwipe = (
  ref: React.RefObject<HTMLElement | null>,
  onSwipe: (direction: Direction) => void,
) => {
  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    };

    const onMove = (e: TouchEvent) => {
      if (tracking) e.preventDefault();
    };

    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (Math.max(absX, absY) < MIN_DISTANCE) return;

      if (absX > absY) {
        onSwipe(dx > 0 ? "right" : "left");
      } else {
        onSwipe(dy > 0 ? "down" : "up");
      }
    };

    target.addEventListener("touchstart", onStart, { passive: true });
    target.addEventListener("touchmove", onMove, { passive: false });
    target.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      target.removeEventListener("touchstart", onStart);
      target.removeEventListener("touchmove", onMove);
      target.removeEventListener("touchend", onEnd);
    };
  }, [ref, onSwipe]);
};
