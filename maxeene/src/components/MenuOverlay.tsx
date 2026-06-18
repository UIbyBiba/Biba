import { AnimatePresence, motion } from "framer-motion";
import { films } from "../films";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MenuOverlay({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="menu-overlay"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="menu-head">
            <div className="brand light">
              <b>Maxeene</b>
              <span>Film Foundation</span>
            </div>
            <button className="menu-btn light" type="button" onClick={onClose}>
              Close
              <span className="bars" aria-hidden>
                <i style={{ transform: "rotate(45deg) translateY(3px)" }} />
                <i style={{ transform: "rotate(-45deg) translateY(-3px)" }} />
              </span>
            </button>
          </div>

          <nav className="menu-list">
            {films.map((f, i) => (
              <motion.button
                key={f.id}
                type="button"
                className="menu-item"
                onClick={() => onSelect(i)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.06 }}
              >
                <span className="menu-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="menu-title">{f.title}</span>
                <span className="menu-dir">{f.director}</span>
              </motion.button>
            ))}
          </nav>

          <div className="menu-foot">
            <span>(01) Couture</span>
            <span>Selected Programme — 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
