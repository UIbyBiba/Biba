export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

/**
 * Images keyed to the original Figma gallery grid (read row by row).
 * Files live in /public/images and are the same source assets exported
 * from the Figma file — only the file names changed.
 */
export const images: GalleryImage[] = [
  { id: 1, src: "/images/01-pizza.jpg", alt: "Loaded pizza on a wooden board" },
  { id: 2, src: "/images/02-graffiti.jpg", alt: "Friends in front of a graffiti wall" },
  { id: 3, src: "/images/03-candle.jpg", alt: "A lit candle glowing warmly" },
  { id: 4, src: "/images/04-pants.jpg", alt: "Person in green cargo trousers" },
  { id: 5, src: "/images/05-dog.jpg", alt: "A husky resting close to the camera" },
  { id: 6, src: "/images/06-baby.jpg", alt: "A baby in a white dress on grass" },
  { id: 7, src: "/images/07-pool.jpg", alt: "Palm trees beside a swimming pool" },
  { id: 8, src: "/images/08-paintings.jpg", alt: "Framed paintings on a gallery wall" },
  { id: 9, src: "/images/09-food.jpg", alt: "A plated meal with a candle" },
  { id: 10, src: "/images/10-car.jpg", alt: "A yellow buggy kicking up smoke" },
  { id: 11, src: "/images/11-hill.jpg", alt: "Two people overlooking a green valley" },
  { id: 12, src: "/images/12-phone.jpg", alt: "A coral phone resting on denim" },
];

/** The hilltop shot is the image shown large by default in the Figma frame. */
export const DEFAULT_ACTIVE_ID = 11;
