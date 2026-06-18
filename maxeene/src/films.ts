export interface Film {
  id: string;
  title: string;
  quote: string;
  image: string;
  year: string;
  runtime: string;
  format: string;
  director: string;
  release: string;
  synopsis: string;
}

// The most anticipated / acclaimed films of 2026.
// Posters are the official key art sourced from Wikipedia.
export const films: Film[] = [
  {
    id: "the-odyssey",
    title: "The Odyssey",
    quote: "An odyssey carved in IMAX",
    image: "/films/odyssey.jpg",
    year: "2026",
    runtime: "02:46:00",
    format: "IMAX · 70mm",
    director: "Christopher Nolan",
    release: "17 July 2026",
    synopsis:
      "Shot entirely with IMAX film cameras, Christopher Nolan reimagines Homer's epic as Odysseus fights to return home across a hostile, mythic world.",
  },
  {
    id: "dune-part-three",
    title: "Dune: Part Three",
    quote: "The epic conclusion",
    image: "/films/dune3.jpg",
    year: "2026",
    runtime: "02:40:00",
    format: "IMAX · 2D",
    director: "Denis Villeneuve",
    release: "18 December 2026",
    synopsis:
      "Denis Villeneuve closes his Dune saga as Paul Atreides confronts the cost of prophecy and the future he has unleashed upon the galaxy.",
  },
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    quote: "Hope at the edge of space",
    image: "/films/hailmary.jpg",
    year: "2026",
    runtime: "02:08:00",
    format: "2D · 4K",
    director: "Lord & Miller",
    release: "20 March 2026",
    synopsis:
      "A lone astronaut wakes with no memory aboard a ship light-years from Earth, humanity's last hope against an extinction-level threat to the sun.",
  },
  {
    id: "bone-temple",
    title: "28 Years Later: The Bone Temple",
    quote: "Terror, reborn",
    image: "/films/bonetemple.jpg",
    year: "2026",
    runtime: "01:54:00",
    format: "2D · 35mm",
    director: "Nia DaCosta",
    release: "16 January 2026",
    synopsis:
      "Nia DaCosta iterates on the rage-virus mythology in devious and unexpected ways, raising the bar for the year's studio horror.",
  },
  {
    id: "avengers-doomsday",
    title: "Avengers: Doomsday",
    quote: "Every hero answers",
    image: "/films/doomsday.jpg",
    year: "2026",
    runtime: "02:30:00",
    format: "3D · IMAX",
    director: "The Russo Brothers",
    release: "18 December 2026",
    synopsis:
      "The Multiverse Saga reaches its breaking point as Earth's heroes unite against Doctor Doom in the most consequential Avengers chapter yet.",
  },
  {
    id: "toy-story-5",
    title: "Toy Story 5",
    quote: "The toys return",
    image: "/films/toystory5.jpg",
    year: "2026",
    runtime: "01:40:00",
    format: "3D · Animation",
    director: "Andrew Stanton",
    release: "19 June 2026",
    synopsis:
      "Woody, Buzz and the gang face their most modern challenge yet when children begin trading their toys for gadgets and glowing screens.",
  },
];
