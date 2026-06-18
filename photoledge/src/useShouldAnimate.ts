import { useEffect, useState } from "react";

/**
 * Returns whether entrance animations should play.
 *
 * Browsers throttle `requestAnimationFrame` in hidden/background tabs (and the
 * dev preview runs in one), which freezes Framer Motion animations at their
 * `initial` state — leaving content that fades in from `opacity: 0` invisible.
 * When the tab is hidden we render the final state instead (via `initial={false}`),
 * then switch to animating once the tab becomes visible.
 */
export function useShouldAnimate(): boolean {
  const [animate, setAnimate] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    if (animate) return;
    const onVisible = () => {
      if (!document.hidden) setAnimate(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [animate]);

  return animate;
}
