import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { photos } from "../photos";
import PhotoCard, { type PhotoCardHandle } from "./PhotoCard";
import { useShouldAnimate } from "../useShouldAnimate";

interface Layout {
  isMobile: boolean;
  design: { w: number; h: number };
  margin: number;
  scale: number;
  boardW: number;
  boardH: number;
}

// The board has a fixed "design canvas" that we scale to fill the viewport width,
// leaving an equal margin on the left, right and bottom on every screen size.
function computeLayout(): Layout {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const isMobile = vw < 700;
  const design = isMobile ? { w: 390, h: 1120 } : { w: 1440, h: 693 };
  const margin = isMobile ? 14 : 24;
  const maxScale = isMobile ? 1.1 : 1.4; // don't blow the artwork up on huge screens
  const scale = Math.min((vw - margin * 2) / design.w, maxScale);
  return { isMobile, design, margin, scale, boardW: design.w * scale, boardH: design.h * scale };
}

export default function PhotoLedge() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const shouldAnimate = useShouldAnimate();

  const [layout, setLayout] = useState<Layout>(computeLayout);
  useEffect(() => {
    const onResize = () => setLayout(computeLayout());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { isMobile, design, margin, scale, boardW, boardH } = layout;

  // Tap-to-place state (mobile) + stacking order (both).
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const zCounter = useRef(photos.length);
  const cardHandles = useRef(new Map<string, PhotoCardHandle>());

  // Dropping back to desktop cancels any in-progress pick.
  useEffect(() => {
    if (!isMobile) setPickedId(null);
  }, [isMobile]);

  const bringToFront = (id: string) => {
    zCounter.current += 1;
    const next = zCounter.current;
    setZMap((m) => ({ ...m, [id]: next }));
  };

  const pick = (id: string) => {
    bringToFront(id);
    setPickedId(id);
  };

  // While a card is picked, the next tap anywhere on the board places it there.
  const place = (e: React.PointerEvent) => {
    if (!pickedId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / scale;
    const dy = (e.clientY - rect.top) / scale;
    cardHandles.current.get(pickedId)?.placeAt(dx, dy);
    setPickedId(null);
  };

  return (
    <section className="ledge" style={{ paddingLeft: margin, paddingRight: margin, paddingBottom: margin }}>
      <motion.header
        className="ledge__intro"
        initial={shouldAnimate ? { opacity: 0, y: -16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1>hang your Favorite photos</h1>
        <p>{isMobile ? "Tap a photo to pick it up, tap again to place it" : "Drag the photos and arrange them"}</p>
      </motion.header>

      <motion.div
        className="ledge__board"
        style={{ width: boardW, height: boardH }}
        initial={shouldAnimate ? { opacity: 0, scale: 0.98 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      >
        <div className="ledge__mosaic" aria-hidden />
        {/* Fixed-size canvas scaled to fit the board so the photos stay proportional */}
        <div
          ref={canvasRef}
          className="ledge__canvas"
          style={{ width: design.w, height: design.h, transform: `scale(${scale})` }}
        >
          {photos.map((photo, i) => {
            const pos = isMobile ? photo.mobile : photo;
            return (
              <PhotoCard
                // Remount when crossing the breakpoint so the card picks up its
                // new resting position/rotation.
                key={`${photo.id}-${isMobile ? "m" : "d"}`}
                ref={(h) => {
                  if (h) cardHandles.current.set(photo.id, h);
                  else cardHandles.current.delete(photo.id);
                }}
                photo={photo}
                x={pos.x}
                y={pos.y}
                rotate={pos.rotate}
                index={i}
                isMobile={isMobile}
                picked={pickedId === photo.id}
                z={zMap[photo.id] ?? i + 1}
                onPick={() => pick(photo.id)}
                onBringToFront={() => bringToFront(photo.id)}
                constraintsRef={canvasRef}
              />
            );
          })}

          {/* Transparent catcher: while a card is picked, a tap anywhere places it */}
          {isMobile && pickedId && <div className="ledge__placer" onPointerDown={place} />}
        </div>
      </motion.div>
    </section>
  );
}
