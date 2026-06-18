import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A custom two-part cursor:
 *  - a small precise dot that tracks the pointer tightly
 *  - a larger ring that lags behind with a soft spring
 * The whole thing uses `mix-blend-mode: difference`, so it inverts
 * whatever sits beneath it — crisp white on photos, black on the page.
 * On interactive elements the ring swells and the dot fades out.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Raw pointer position.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // The dot is snappy; the ring trails with a looser spring.
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.3 });
  const ringX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 });

  useEffect(() => {
    // Only run on devices with a fine pointer (mouse/trackpad).
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, .thumb, [data-cursor='hover']"));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="cursor-root" aria-hidden>
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: pressed ? 0.8 : hovering ? 2.6 : 1,
          opacity: hovering ? 1 : 0.7,
          borderWidth: hovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: hovering ? 0 : pressed ? 1.6 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </div>
  );
}
