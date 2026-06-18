import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { films } from "./films";
import Intro from "./components/Intro";
import MenuOverlay from "./components/MenuOverlay";
import FilmDetail from "./components/FilmDetail";
import "./App.css";

// Cinematic "projector focus-pull" easing.
const EASE = [0.16, 1, 0.3, 1] as const;

export default function App() {
  const [active, setActive] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detail, setDetail] = useState<number | null>(null);
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();

  // Scroll-driven selection: the row whose centre is nearest the viewport
  // centre line becomes active. rAF-throttled for smoothness.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mid = window.innerHeight / 2;
        let best = 0;
        let bestDist = Infinity;
        rowRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive((prev) => (prev === best ? prev : best));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock body scroll while the intro, menu, or a detail page is up.
  useEffect(() => {
    const lock = !introDone || menuOpen || detail !== null;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone, menuOpen, detail]);

  const film = films[active];

  return (
    <div className="stage">
      <AnimatePresence>
        {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      </AnimatePresence>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(i) => {
          setMenuOpen(false);
          setDetail(i);
        }}
      />

      <FilmDetail film={detail !== null ? films[detail] : null} onClose={() => setDetail(null)} />

      <div className="guides" aria-hidden />

      {/* Navigation ------------------------------------------------ */}
      <header className="nav">
        <button
          className="brand brand-btn"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <b>Maxeene</b>
          <span>Film Foundation</span>
        </button>
        <nav className="nav-center">(01) Couture</nav>
        <button className="menu-btn" type="button" onClick={() => setMenuOpen(true)}>
          Menu
          <span className="bars" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>

      <p className="tagline">
        See the latest films and live events in 2D and 3D at Vue cinemas.
      </p>

      {/* Fixed centre film frame ----------------------------------- */}
      <button
        className="frame-wrap"
        aria-label={`Open ${film.title}`}
        onClick={() => setDetail(active)}
      >
        <div className="frame">
          <div className="frame-inner">
            <AnimatePresence>
              <motion.img
                key={film.id + active}
                src={film.image}
                alt=""
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.12, filter: "brightness(2) blur(7px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.04, filter: "brightness(0.4) blur(5px)" }
                }
                transition={{ duration: reduceMotion ? 0.25 : 0.95, ease: EASE }}
              />
            </AnimatePresence>

            {/* projector scanline sweep on each change */}
            {!reduceMotion && (
              <motion.div
                key={"scan" + active}
                className="scanline"
                initial={{ top: "-30%", opacity: 0 }}
                animate={{ top: "110%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            )}

            {/* letterbox shutter wipe on each change */}
            {!reduceMotion && (
              <>
                <motion.div
                  key={"sh-t" + active}
                  className="shutter top"
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
                <motion.div
                  key={"sh-b" + active}
                  className="shutter bottom"
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              </>
            )}

            <div className="grain" />

            <div className="hud tl">
              <span className="rec-dot" />
              REC · {film.format}
            </div>
            <div className="hud br">
              <AnimatePresence mode="wait">
                <motion.span
                  key={film.runtime}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                >
                  {film.runtime}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <span className="frame-hint">View film ↗</span>
      </button>

      {/* Right-edge scrubber --------------------------------------- */}
      <div className="scrubber" aria-hidden>
        {films.map((f, i) => (
          <span key={f.id} className={"tick" + (i === active ? " on" : "")} />
        ))}
      </div>

      {/* Scrolling reel of film titles ----------------------------- */}
      <main className="reel">
        <div className="spacer" />
        {films.map((f, i) => (
          <section
            key={f.id}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={"row " + (i === active ? "active" : "inactive")}
          >
            {/* Inline poster — shown only on small screens, where the fixed
                centre frame is hidden. Keeps each film self-contained. */}
            <button
              type="button"
              className="row-poster"
              aria-label={`Open ${f.title}`}
              onClick={() => setDetail(i)}
            >
              <img src={f.image} alt={f.title} loading="lazy" />
            </button>

            <motion.button
              type="button"
              className="row-title"
              onClick={() => setDetail(i)}
              animate={{ x: i === active ? 0 : reduceMotion ? 0 : -6 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {f.title}
            </motion.button>

            <div className="row-gap" />

            <div className="row-meta">
              <span className="row-quote">&ldquo;{f.quote}&rdquo;</span>
              <span className="row-index">
                {String(i + 1).padStart(2, "0")} / {String(films.length).padStart(2, "0")} ·{" "}
                {f.director}
              </span>
            </div>
          </section>
        ))}
        <div className="spacer" />
        <div className="footer-note">Maxeene Film Foundation — Scroll to screen each title</div>
      </main>
    </div>
  );
}
