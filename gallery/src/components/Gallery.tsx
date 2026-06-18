import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { images, DEFAULT_ACTIVE_ID, type GalleryImage } from "../data";

/* Container drives the staggered "bit by bit after a delay" entrance. */
const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.07,
    },
  },
};

/* Each thumbnail pops in: fade + lift + a soft scale + a touch of blur. */
const thumbVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function Gallery() {
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID);
  const active = images.find((img) => img.id === activeId) as GalleryImage;

  const stageRef = useRef<HTMLDivElement>(null);

  // Cursor position (relative to the stage) and the reveal radius.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const radius = useMotionValue(0);

  // Soft springs so the spotlight glides after the cursor instead of snapping.
  const sx = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 500, damping: 40, mass: 0.4 });
  const sr = useSpring(radius, { stiffness: 200, damping: 28, mass: 0.5 });

  // A radial mask: opaque inside the circle (feathered edge), transparent outside.
  const mask = useMotionTemplate`radial-gradient(circle ${sr}px at ${sx}px ${sy}px, #000 0%, #000 68%, rgba(0,0,0,0) 100%)`;

  const updatePointer = (e: React.MouseEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const handleEnter = (e: React.MouseEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
    radius.set(rect.width * 0.34); // grow the spotlight in
  };

  const handleLeave = () => radius.set(0); // collapse it back to full colour

  return (
    <div className="gallery">
      <motion.div
        className="gallery__grid"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((img) => {
          const isActive = img.id === activeId;
          return (
            <motion.button
              key={img.id}
              type="button"
              className="thumb"
              variants={thumbVariants}
              onClick={() => setActiveId(img.id)}
              whileHover={{ scale: 1.06, zIndex: 2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              aria-label={`Show ${img.alt}`}
              aria-pressed={isActive}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              {isActive && (
                <motion.span
                  layoutId="active-ring"
                  className="thumb__ring"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        className="preview"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="preview__dots" aria-hidden />
        <div
          className="preview__stage"
          ref={stageRef}
          onMouseEnter={handleEnter}
          onMouseMove={updatePointer}
          onMouseLeave={handleLeave}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={active.id}
              className="preview__frame"
              initial={{ opacity: 0, scale: 1.12, filter: "blur(14px)", clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Base layer: full colour. */}
              <img
                className="preview__layer preview__layer--color"
                src={active.src}
                alt={active.alt}
                draggable={false}
              />
              {/* Top layer: black & white, revealed only inside the cursor spotlight. */}
              <motion.img
                className="preview__layer preview__layer--gray"
                src={active.src}
                alt=""
                aria-hidden
                draggable={false}
                style={{ WebkitMaskImage: mask, maskImage: mask }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
