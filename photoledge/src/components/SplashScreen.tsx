import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useShouldAnimate } from "../useShouldAnimate";
import "./SplashScreen.css";

export interface SplashScreenProps {
  /**
   * The photos that slide out of the envelope, front-most last.
   * Supply your own image URLs/paths here. Defaults to the bundled photos.
   */
  photos?: string[];
  /** Called once the splash has finished animating out, so the host can unmount it. */
  onComplete?: () => void;
}

const DEFAULT_PHOTOS = [
  "/photos/photo1.png",
  "/photos/photo2.png",
  "/photos/photo3.png",
  "/photos/photo4.png",
];

interface FanTarget {
  x: number;
  y: number;
  rotate: number;
}

// Spread the photos into a symmetric fanned arc as they rise out of the envelope:
// centre photos sit highest, edges splay outward and tilt more.
function fanLayout(count: number): FanTarget[] {
  const SPREAD = 150; // horizontal distance between neighbouring photos
  const TILT = 13; // degrees added per step from centre
  const LIFT = -200; // how high the centre photo rises
  const ARC = 70; // how much lower the outer photos sit
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    const offset = i - mid; // …-1, 0, 1…
    return {
      x: offset * SPREAD,
      y: LIFT + Math.abs(offset) * ARC,
      rotate: offset * TILT,
    };
  });
}

// Parent orchestrates the staggered reveal, starting after the flap has opened.
const photosContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.45, staggerChildren: 0.12 },
  },
};

// Custom-driven so each photo flies to its own spot in the fan.
// They start tucked INSIDE the envelope (y: 0 keeps them above the bottom edge,
// hidden behind the front pocket) and only travel upward — so they read as
// sliding out of the envelope, never from underneath it.
const photoVariants: Variants = {
  hidden: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.92 },
  visible: ({ x, y, rotate }: FanTarget) => ({
    x,
    y,
    rotate,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SplashScreen({ photos = DEFAULT_PHOTOS, onComplete }: SplashScreenProps) {
  const [done, setDone] = useState(false);
  const shouldAnimate = useShouldAnimate();

  // Pointer position (-0.5 → 0.5) drives a subtle parallax on the photos.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  useEffect(() => {
    // Flap (0.5s) + staggered photos (~1s) + a short hold ≈ 2.5s total.
    const timer = setTimeout(() => setDone(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Guarantee dismissal once the exit starts — independent of the exit
  // animation finishing (rAF is throttled in hidden tabs, so we can't rely
  // on onAnimationComplete firing there).
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => onComplete?.(), 450);
    return () => clearTimeout(timer);
  }, [done, onComplete]);

  const handlePointerMove = (e: React.PointerEvent) => {
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <motion.div
      className="splash-overlay"
      onPointerMove={handlePointerMove}
      initial={{ opacity: 1, scale: 1 }}
      // Plain object animate (not a variant label) so it does NOT propagate
      // variants to the children — they run their own reveal independently.
      animate={done ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeIn" }}
    >
      <div className="splash-board" aria-hidden />
      <div className="splash-stage">
        <div className="splash-envelope">
          {/* Envelope back wall — clips photos until they rise out the top */}
          <div className="splash-envelope__body">
            <div className="splash-fold splash-fold--left" />
            <div className="splash-fold splash-fold--right" />
          </div>

          {/* Photos sit inside the envelope and slide up out of the top */}
          <motion.div
            className="splash-photos"
            variants={photosContainer}
            initial={shouldAnimate ? "hidden" : false}
            animate="visible"
          >
            {photos.map((src, i) => (
              <SplashPhoto
                key={i}
                src={src}
                target={fanLayout(photos.length)[i]}
                depth={(i + 1) * 6}
                px={px}
                py={py}
              />
            ))}
          </motion.div>

          {/* Front pocket occludes the lower half so photos look tucked inside */}
          <div className="splash-envelope__pocket">
            <div className="splash-fold splash-fold--left" />
            <div className="splash-fold splash-fold--right" />
          </div>

          {/* The flap: flat when closed, folds back to reveal the green interior */}
          <motion.div
            className="splash-flap"
            initial={shouldAnimate ? { rotateX: 0 } : false}
            animate={{ rotateX: -160 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="splash-flap__face splash-flap__front" />
            <div className="splash-flap__face splash-flap__inside" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface SplashPhotoProps {
  src: string;
  target: FanTarget;
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}

function SplashPhoto({ src, target, depth, px, py }: SplashPhotoProps) {
  // Each photo drifts a little with the pointer; deeper photos move more.
  const parallaxX = useTransform(px, [-0.5, 0.5], [-depth, depth]);
  const parallaxY = useTransform(py, [-0.5, 0.5], [-depth / 2, depth / 2]);

  return (
    <motion.div className="splash-photo-parallax" style={{ x: parallaxX, y: parallaxY }}>
      <motion.div className="splash-photo" variants={photoVariants} custom={target}>
        <div className="splash-polaroid">
          <img src={src} alt="" draggable={false} />
        </div>
      </motion.div>
    </motion.div>
  );
}
