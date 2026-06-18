import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { images, type GalleryImage } from "../data";

/* Staggered "bit by bit" reveal, matching the desktop entrance. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.15, staggerChildren: 0.05 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="tile__plus-svg" aria-hidden>
      <path
        d="M9 3V15M15 9H3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GalleryMobile() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <>
      <motion.div
        className="m-grid"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((img) => (
          <motion.button
            key={img.id}
            type="button"
            className="tile"
            variants={tileVariants}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(img)}
            aria-label={`Open ${img.alt}`}
          >
            <motion.img
              layoutId={`tile-${img.id}`}
              src={img.src}
              alt={img.alt}
              className="tile__img"
              draggable={false}
            />
            <span className="tile__overlay" aria-hidden />
            <span className="tile__plus" aria-hidden>
              <PlusIcon />
            </span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              layoutId={`tile-${selected.id}`}
              src={selected.src}
              alt={selected.alt}
              className="lightbox__img"
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 120) setSelected(null);
              }}
            />
            <motion.button
              type="button"
              className="lightbox__close"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ delay: 0.15 }}
              aria-label="Close image"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
