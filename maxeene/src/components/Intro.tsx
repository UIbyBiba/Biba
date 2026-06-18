import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Academy-leader style countdown that plays on every load / refresh,
 * then lifts away (letterbox open) to reveal the page.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? 0 : 3);
  const [leaving, setLeaving] = useState(false);

  // Drive the countdown.
  useEffect(() => {
    if (reduce) {
      const t = setTimeout(() => setLeaving(true), 400);
      return () => clearTimeout(t);
    }
    if (count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 720);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLeaving(true), 700);
    return () => clearTimeout(t);
  }, [count, reduce]);

  // Reveal the page once the shutters have opened. Driven by a timer
  // (not an animation callback) so it always fires.
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 950);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <motion.div
      className="intro"
      initial={false}
      animate={leaving ? "leave" : "show"}
      onClick={() => setLeaving(true)}
    >
      {/* top + bottom shutters that open to reveal the page */}
      <motion.div
        className="intro-bar top"
        variants={{ show: { scaleY: 1 }, leave: { scaleY: 0 } }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <motion.div
        className="intro-bar bottom"
        variants={{ show: { scaleY: 1 }, leave: { scaleY: 0 } }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <motion.div
        className="intro-center"
        variants={{ show: { opacity: 1 }, leave: { opacity: 0 } }}
        transition={{ duration: 0.35 }}
      >
        {!reduce && count > 0 ? (
          <div className="leader">
            <svg viewBox="0 0 200 200" className="leader-ring">
              <circle cx="100" cy="100" r="96" className="ring-track" />
              <line x1="100" y1="100" x2="100" y2="4" className="ring-cross-v" />
              <line x1="100" y1="100" x2="196" y2="100" className="ring-cross-h" />
              <motion.path
                key={count}
                d="M100 100 L100 4 A96 96 0 0 1 196 100 Z"
                className="ring-sweep"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.72, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
              />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                className="leader-num"
                initial={{ opacity: 0, scale: 1.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="intro-brand"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.18em" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <b>MAXEENE</b>
            <span>FILM FOUNDATION</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
