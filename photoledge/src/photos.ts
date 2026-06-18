export interface Position {
  /** x/y in px within the board's design canvas */
  x: number;
  y: number;
  /** Resting rotation in degrees */
  rotate: number;
}

export interface Photo extends Position {
  id: string;
  /** Path under /public — swap these files (or the strings) to change images. */
  src: string;
  caption: string;
  /** Polaroid frame color */
  frame: string;
  /** Caption text color */
  text: string;
  /** Position within the narrow mobile board (390 × 1120 design canvas) */
  mobile: Position;
}

// Layout & styling taken from the Figma "photo ledge" designs (desktop + mobile).
// The frame colors, captions and rotations are the fixed "assets" — only the
// image files in /public/photos are meant to be replaced.
// `x`/`y`/`rotate` place a card on the 1440×693 desktop canvas; `mobile` places
// it on the 390×1120 mobile canvas.
export const photos: Photo[] = [
  { id: "my-lady",     src: "/photos/photo1.png", caption: "My Lady",              frame: "#fef2ac", text: "#352e00", x: 72,   y: 412, rotate: -13.7,  mobile: { x: 30,  y: 640, rotate: -9 } },
  { id: "hiking",      src: "/photos/photo2.png", caption: "Hiking",               frame: "#eeacfe", text: "#740091", x: 340,  y: 403, rotate: 14.45,  mobile: { x: 158, y: 500, rotate: 14.45 } },
  { id: "city-park",   src: "/photos/photo3.png", caption: "City Park Restaurant", frame: "#c9feac", text: "#352e00", x: 224,  y: 103, rotate: 4.72,   mobile: { x: 6,   y: 80,  rotate: 4.72 } },
  { id: "window-shop", src: "/photos/photo4.png", caption: "Window Shopping",      frame: "#9addff", text: "#002b35", x: 771,  y: 426, rotate: 15.47,  mobile: { x: 172, y: 705, rotate: 7 } },
  { id: "flower-girl", src: "/photos/photo5.png", caption: "Flower Girl",          frame: "#fafafa", text: "#002b35", x: 561,  y: 305, rotate: -12.48, mobile: { x: 176, y: 285, rotate: -12.48 } },
  { id: "dadduma",     src: "/photos/photo6.png", caption: "Dadduma from my Mum",  frame: "#a795ff", text: "#10005d", x: 1168, y: 423, rotate: -18.07, mobile: { x: 80,  y: 860, rotate: -5 } },
  { id: "certificate", src: "/photos/photo7.png", caption: "First ever Certificate", frame: "#ffe2dc", text: "#5b1202", x: 753,  y: 137, rotate: 34.04, mobile: { x: 58,  y: 215, rotate: 34.04 } },
  { id: "birthday",    src: "/photos/photo8.png", caption: "Birthday Cake",        frame: "#febbac", text: "#5b1202", x: 1011, y: 210, rotate: -1.99,  mobile: { x: 14,  y: 445, rotate: -1.99 } },
];
