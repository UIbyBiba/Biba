import { motion, useMotionValue, animate } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from "react";
import type { Photo } from "../photos";
import { useShouldAnimate } from "../useShouldAnimate";

export interface PhotoCardHandle {
  /** Move the card so its centre lands on the given point in canvas (design) coords. */
  placeAt: (designX: number, designY: number) => void;
}

interface PhotoCardProps {
  photo: Photo;
  /** Resting position within the current board canvas (desktop or mobile). */
  x: number;
  y: number;
  rotate: number;
  /** Index used to stagger the entrance animation. */
  index: number;
  /** Mobile uses tap-to-place instead of dragging. */
  isMobile: boolean;
  /** True while this card is "picked up" on mobile. */
  picked: boolean;
  /** Stacking order. */
  z: number;
  /** Tap handler used to pick the card up on mobile. */
  onPick: () => void;
  /** Raise this card to the top. */
  onBringToFront: () => void;
  /** Board element used to constrain dragging / placement. */
  constraintsRef: RefObject<HTMLDivElement | null>;
}

const PhotoCard = forwardRef<PhotoCardHandle, PhotoCardProps>(function PhotoCard(
  { photo, x, y, rotate: rotateDeg, index, isMobile, picked, z, onPick, onBringToFront, constraintsRef },
  ref,
) {
  const shouldAnimate = useShouldAnimate();
  const cardRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  // Rotation + drag/placement offset are motion values so the handle and the
  // tap-to-place logic can drive them while framer-motion handles the rest.
  const rotate = useMotionValue(rotateDeg);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // Imperative placement used by the mobile tap-to-place flow.
  useImperativeHandle(
    ref,
    () => ({
      placeAt(dx: number, dy: number) {
        const el = cardRef.current;
        if (!el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        // Keep the whole card on the board.
        const board = constraintsRef.current;
        let tx = dx;
        let ty = dy;
        if (board) {
          tx = Math.min(Math.max(dx, w / 2), board.offsetWidth - w / 2);
          ty = Math.min(Math.max(dy, h / 2), board.offsetHeight - h / 2);
        }
        const spring = { type: "spring" as const, stiffness: 320, damping: 28 };
        animate(offsetX, tx - (x + w / 2), spring);
        animate(offsetY, ty - (y + h / 2), spring);
      },
    }),
    [x, y, offsetX, offsetY, constraintsRef],
  );

  // Keep the latest bring-to-front callback in a ref so the rotate listener
  // below can stay attached for the whole gesture (the prop identity changes
  // every render, which would otherwise tear the listeners down mid-rotate).
  const bringToFrontRef = useRef(onBringToFront);
  bringToFrontRef.current = onBringToFront;

  // Drag-to-rotate via the corner handle (native listener so framer's native
  // drag/tap listeners don't also fire — a React stopPropagation wouldn't reach them).
  useEffect(() => {
    const handle = handleRef.current;
    const card = cardRef.current;
    if (!handle || !card) return;

    let rotating = false;
    let startPointer = 0;
    let startRotation = 0;

    const angleToPointer = (px: number, py: number) => {
      const r = card.getBoundingClientRect();
      return (Math.atan2(py - (r.top + r.height / 2), px - (r.left + r.width / 2)) * 180) / Math.PI;
    };

    const onMove = (e: PointerEvent) => {
      if (!rotating) return;
      rotate.set(startRotation + (angleToPointer(e.clientX, e.clientY) - startPointer));
    };

    const onUp = () => {
      rotating = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    const onDown = (e: PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      rotating = true;
      startPointer = angleToPointer(e.clientX, e.clientY);
      startRotation = rotate.get();
      bringToFrontRef.current();
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    handle.addEventListener("pointerdown", onDown);
    return () => {
      handle.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // Attach once: `rotate` is a stable motion value and bring-to-front is read
    // from a ref, so the listeners persist across re-renders / z-index changes.
  }, [rotate]);

  return (
    <motion.div
      ref={cardRef}
      className={`photo-card${picked ? " photo-card--picked" : ""}`}
      style={{
        left: x,
        top: y,
        x: offsetX,
        y: offsetY,
        rotate,
        backgroundColor: photo.frame,
        zIndex: picked ? 9999 : z,
      }}
      drag={!isMobile}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.12}
      // When the tab is hidden, skip the entrance so the card isn't stuck invisible.
      initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: picked ? 1.12 : 1 }}
      whileHover={!isMobile ? { scale: 1.04 } : undefined}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
        opacity: { duration: 0.4, delay: shouldAnimate ? 0.3 + index * 0.07 : 0 },
        scale: { duration: 0.3 },
      }}
      onTap={() => {
        if (isMobile && !picked) onPick();
      }}
      onPointerDown={onBringToFront}
    >
      <div className="photo-card__image">
        <img src={photo.src} alt={photo.caption} draggable={false} />
      </div>
      <p className="photo-card__caption" style={{ color: photo.text }}>
        {photo.caption}
      </p>
      <button
        ref={handleRef}
        type="button"
        className="photo-card__rotate"
        aria-label="Drag to rotate photo"
        title="Drag to rotate"
      >
        ⟳
      </button>
    </motion.div>
  );
});

export default PhotoCard;
