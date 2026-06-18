# Photo Ledge

A draggable photo board built from the Figma "photo ledge" design — Vite + React + TypeScript, with [Framer Motion](https://www.framer.com/motion/) for the entrance animations and cursor dragging.

**Interacting with a photo:**
- **Desktop:** drag the body of a photo to move it; hover and drag the small **⟳ handle**
  at its top-right corner to rotate it.
- **Mobile / touch:** *tap* a photo to pick it up (it lifts), then *tap anywhere* on the
  board to place it there. The ⟳ rotate handle stays visible and works by dragging.

The board itself is responsive: a fixed design canvas (1440×693 desktop, 390×1120 mobile)
scaled to fill the viewport width with equal margins on the left, right and bottom.

## Run

```bash
npm install
npm run dev      # http://localhost:5173 (or :5175 in the preview)
npm run build    # production build
```

## Changing the images

The frames, colors, captions, rotations and layout are fixed "assets" from the
design. **Only the photos are meant to change.** Two ways:

1. **Drop-in replace** — overwrite the files in [`public/photos/`](public/photos)
   (`photo1.png` … `photo8.png`) with your own, keeping the same filenames.
2. **Point to new files** — edit [`src/photos.ts`](src/photos.ts) and change each
   entry's `src` (and `caption` if you like). You can also tweak `x` / `y` /
   `rotate` to reposition a card or `frame` / `text` to recolor it.

Images use `object-fit: cover`, so any aspect ratio crops cleanly to the frame.

### The splash-screen photos (the envelope)

The intro splash shows photos sliding out of an envelope. Change those images
either way:

1. **Drop-in replace** the same `public/photos/photo1–4.png` files, **or**
2. **Pass your own** to the component in [`src/App.tsx`](src/App.tsx):

   ```tsx
   <SplashScreen
     photos={["/photos/a.jpg", "/photos/b.jpg", "/photos/c.jpg", "/photos/d.jpg"]}
     onComplete={() => setShowSplash(false)}
   />
   ```

   Supply 4–5 image paths; the fan-out angles are defined by `ROTATIONS` in
   [`src/components/SplashScreen.tsx`](src/components/SplashScreen.tsx).

## Structure

- `src/photos.ts` — the board photo data (the file you'll usually edit)
- `src/components/PhotoCard.tsx` — a single draggable polaroid (Framer Motion `drag`)
- `src/components/PhotoLedge.tsx` — the board, drag constraints, stagger animation
- `src/components/SplashScreen.tsx` — the envelope intro (Framer Motion flap + stagger)
- `src/App.tsx` — shows the splash, then the board once it completes
- `src/App.css`, `src/components/SplashScreen.css` — styling
