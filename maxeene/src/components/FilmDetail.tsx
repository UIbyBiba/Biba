import { AnimatePresence, motion } from "framer-motion";
import type { Film } from "../films";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FilmDetail({
  film,
  onClose,
}: {
  film: Film | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {film && (
        <motion.div
          className="detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            className="detail-close"
            type="button"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ✕ Close
          </motion.button>

          <div className="detail-grid">
            <motion.div
              className="detail-poster"
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.06 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <img src={film.image} alt={film.title} />
            </motion.div>

            <div className="detail-info">
              <motion.span
                className="detail-eyebrow"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              >
                Now Programming · {film.format}
              </motion.span>

              <motion.h2
                className="detail-title"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
              >
                {film.title}
              </motion.h2>

              <motion.p
                className="detail-quote"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.42 }}
              >
                &ldquo;{film.quote}&rdquo;
              </motion.p>

              <motion.p
                className="detail-synopsis"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
              >
                {film.synopsis}
              </motion.p>

              <motion.dl
                className="detail-specs"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.58 }}
              >
                <div>
                  <dt>Director</dt>
                  <dd>{film.director}</dd>
                </div>
                <div>
                  <dt>Runtime</dt>
                  <dd>{film.runtime}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{film.format}</dd>
                </div>
                <div>
                  <dt>Release</dt>
                  <dd>{film.release}</dd>
                </div>
              </motion.dl>

              <motion.button
                className="detail-cta"
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.66 }}
                onClick={onClose}
              >
                Book Screening
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
