import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadFreckle } from "@remotion/google-fonts/FreckleFace";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";

const { fontFamily: display } = loadFreckle();
const { fontFamily: serif } = loadFraunces();

const C = {
  cream: "#fdfbf4",
  pink: "#ffdbd6",
  maroon: "#702e25",
  berry: "#801026",
  lilac: "#ebdeff",
  peri: "#ccd8ff",
  t1: "#fc9b7a",
  t2: "#fc9bbe",
  t3: "#fff2de",
  t4: "#e3e770",
};

const A = (n: string) => staticFile("assets/" + n);

// ---- helpers ----
const useSpringIn = (delay = 0, config = { damping: 14, mass: 0.7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

const Pill: React.FC<{ children: React.ReactNode; bg: string; delay: number }> = ({
  children,
  bg,
  delay,
}) => {
  const s = useSpringIn(delay);
  return (
    <div
      style={{
        transform: `scale(${s})`,
        background: bg,
        color: C.maroon,
        borderRadius: 16,
        padding: "20px 44px",
        fontSize: 34,
        textTransform: "uppercase",
        fontFamily: "Arial, sans-serif",
        letterSpacing: 1,
        display: "inline-flex",
        gap: 16,
        boxShadow: "0 10px 30px rgba(112,46,37,0.18)",
      }}
    >
      {children}
    </div>
  );
};

// ---- Scene 1: Logo intro ----
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpringIn(6, { damping: 12, mass: 0.9 });
  const tag = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const badge = useSpringIn(28);
  return (
    <AbsoluteFill style={{ background: C.cream, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ backgroundImage: `url(${A("bg-grid.png")})`, backgroundSize: "cover", opacity: 0.15 }} />
      <Img src={A("playground-sticker.svg")} style={{ position: "absolute", width: 150, top: 150, left: 280, transform: `rotate(-12deg) scale(${badge})` }} />
      <Img src={A("rocky-flower.svg")} style={{ position: "absolute", width: 150, bottom: 170, right: 300, transform: `scale(${badge})` }} />
      <div style={{ textAlign: "center", transform: `scale(${logo})` }}>
        <div style={{ fontFamily: display, fontSize: 220, color: C.berry, letterSpacing: 14, lineHeight: 1 }}>
          CANDi
        </div>
      </div>
      <div style={{ opacity: tag, marginTop: 30, fontFamily: "Arial, sans-serif", fontSize: 34, letterSpacing: 6, textTransform: "uppercase", color: C.maroon }}>
        The Swedish Candy Cart
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 2: Hero ----
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const words = "The Swedish Candi Cart Of Your Dreams".split(" ");
  const toast = useSpringIn(8, { damping: 13, mass: 1 });
  const sub = interpolate(frame, [40, 58], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <AbsoluteFill style={{ backgroundImage: `url(${A("bg-grid.png")})`, backgroundSize: "cover", opacity: 0.15 }} />
      <div style={{ position: "absolute", left: 120, top: 220, width: 880 }}>
        <div style={{ fontFamily: display, fontSize: 96, color: C.maroon, lineHeight: 1.0 }}>
          {words.map((w, i) => {
            const o = interpolate(frame, [i * 5, i * 5 + 12], [0, 1], { extrapolateRight: "clamp" });
            const y = interpolate(frame, [i * 5, i * 5 + 12], [30, 0], { extrapolateRight: "clamp" });
            return (
              <span key={i} style={{ display: "inline-block", opacity: o, transform: `translateY(${y}px)`, marginRight: 24 }}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ opacity: sub, marginTop: 36, fontFamily: "Arial, sans-serif", fontSize: 34, color: C.maroon, lineHeight: 1.35, maxWidth: 720 }}>
          Your go-to cart for events &amp; catering, monthly candy club deliveries, online candy and more.
        </div>
        <div style={{ marginTop: 48 }}>
          <Pill bg={C.peri} delay={62}>
            <span>Join the club</span>
            <span>→</span>
          </Pill>
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 180, width: 640, transform: `rotate(11deg) scale(${toast})`, transformOrigin: "center" }}>
        <Img src={A("hero-toast.png")} style={{ width: "100%" }} />
      </div>
      <Img src={A("candilicious-badge.svg")} style={{ position: "absolute", right: 560, top: 150, width: 180, transform: `rotate(12deg) scale(${toast})` }} />
    </AbsoluteFill>
  );
};

// ---- Scene 3: Benefit grid ----
const Tile: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const s = useSpringIn(delay, { damping: 15, mass: 0.6 });
  return (
    <div style={{ overflow: "hidden", transform: `scale(${s})`, opacity: s, ...style }}>{children}</div>
  );
};

const Quote: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30 }}>
    <span style={{ fontFamily: serif, fontSize: 34, color, lineHeight: 1.2, letterSpacing: -1 }}>{text}</span>
  </div>
);

const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

const SceneGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const col = "1fr 1fr 1fr";
  return (
    <AbsoluteFill style={{ background: C.cream, padding: "70px 110px" }}>
      <div style={{ opacity: head, marginBottom: 28 }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 26, textTransform: "uppercase", color: C.maroon, marginBottom: 10 }}>Benefit</div>
        <div style={{ fontFamily: display, fontSize: 60, color: C.maroon, lineHeight: 1.05 }}>Your gut knows, so does your Candy</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: col, gap: 14, height: 620 }}>
        <div style={{ display: "grid", gridTemplateRows: "1fr 2fr", gap: 14 }}>
          <Tile delay={10} style={{ background: "#686413" }}><Img src={A("grid-ribbon.png")} style={cover} /></Tile>
          <Tile delay={18} style={{ background: C.t1 }}><Img src={A("grid-bubblegum.png")} style={cover} /></Tile>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gap: 14 }}>
          <Tile delay={14} style={{ background: C.t2 }}><Quote text="One candy a day makes the mind rich, and the body strong!" color="#600023" /></Tile>
          <Tile delay={22} style={{ background: C.peri }}><Img src={A("grid-candyland.png")} style={cover} /></Tile>
          <Tile delay={30} style={{ background: C.t3 }}><Quote text="Join the free club for healthy candies and gum." color="#663e00" /></Tile>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "2fr 1fr", gap: 14 }}>
          <Tile delay={16} style={{ background: C.t4 }}><Img src={A("grid-peppermint.png")} style={cover} /></Tile>
          <Tile delay={26} style={{ background: C.t1 }}><Img src={A("grid-lolly.png")} style={cover} /></Tile>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 4: Outro ----
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const word = useSpringIn(6, { damping: 12, mass: 1 });
  const cta = useSpringIn(40);
  const sub = interpolate(frame, [18, 34], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.berry, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Img src={A("grid-lolly.png")} style={{ position: "absolute", width: 300, left: 90, bottom: 90, borderRadius: 12, transform: `scale(${cta})` }} />
      <Img src={A("grid-bubblegum.png")} style={{ position: "absolute", width: 280, right: 110, top: 110, borderRadius: 12, transform: `scale(${cta})` }} />
      <div style={{ opacity: sub, fontFamily: "Arial, sans-serif", fontSize: 32, letterSpacing: 5, textTransform: "uppercase", color: C.pink, marginBottom: 8 }}>
        Your candy cart awaits
      </div>
      <div style={{ fontFamily: display, fontSize: 200, color: C.pink, letterSpacing: -4, transform: `scale(${word})`, lineHeight: 1 }}>
        candi-licious
      </div>
      <div style={{ marginTop: 50 }}>
        <Pill bg={C.pink} delay={44}>
          <span>Join the club</span>
          <span>→</span>
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

// ---- transition wrapper (fade in/out at edges) ----
const Fade: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const opacity = interpolate(local, [0, 12, dur - 12, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const CandiDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Sequence durationInFrames={95}>
        <Fade from={0} dur={95}><SceneIntro /></Fade>
      </Sequence>
      <Sequence from={95} durationInFrames={150}>
        <Fade from={0} dur={150}><SceneHero /></Fade>
      </Sequence>
      <Sequence from={245} durationInFrames={150}>
        <Fade from={0} dur={150}><SceneGrid /></Fade>
      </Sequence>
      <Sequence from={395} durationInFrames={145}>
        <Fade from={0} dur={145}><SceneOutro /></Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
