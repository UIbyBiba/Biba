import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

// reveal-on-scroll helper props
const reveal = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.25 },
};

function Nav() {
  return (
    <motion.nav
      className="nav"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="logo">CANDi</div>
      <div className="nav-links">
        <a href="#">Find the cart</a>
        <a href="#">Candy club</a>
        <a href="#">Book an event</a>
        <a href="#">Buy candy</a>
      </div>
      <motion.button className="btn btn-lilac" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
        <span className="hide-mobile">Join for free →</span>
        <span className="show-mobile">Menu</span>
      </motion.button>
    </motion.nav>
  );
}

/**
 * Decoration: the OUTER div keeps its CSS position transform
 * (translate/rotate) untouched; the INNER element animates opacity + scale
 * around its own center, so the badge container is never distorted.
 */
function Deco({ className, src, label, delay = 0, hover }) {
  return (
    <div className={`deco ${className}`}>
      <motion.div
        className="deco-inner"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, ease }}
        whileHover={hover || { scale: 1.18 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={src} alt="" />
        {label && <span>{label}</span>}
      </motion.div>
    </div>
  );
}

function Hero() {
  const words = "The Swedish Candi Cart Of Your Dreams".split(" ");
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-box">
        <motion.div className="hero-copy" variants={stagger(0.08, 0.15)} initial="hidden" animate="show">
          <h1 className="hero-h1 display">
            {words.map((w, i) => (
              <motion.span key={i} variants={fadeUp} style={{ display: "inline-block", marginRight: "0.25em" }}>
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p className="hero-sub" variants={fadeUp}>
            Your go-to cart to call for events and catering, monthly candy club deliverables, online candy and more.
          </motion.p>
          <motion.button className="btn btn-peri" variants={fadeUp} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            Join the club →
          </motion.button>
        </motion.div>

        {/* toast + stickers: display:contents on desktop (keeps absolute layout),
            becomes a positioning context on mobile so the stickers anchor to the toast */}
        <div className="hero-visual">
        {/* toast: slide + settle into Figma's 11° tilt, then gentle float */}
        <div className="hero-art">
          <motion.div
            className="deco-inner"
            initial={{ opacity: 0, x: 90, rotate: 24 }}
            animate={{ opacity: 1, x: 0, rotate: 11 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            <motion.img
              src="/assets/hero-toast.png"
              alt="Candy-loaded toast"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        <Deco
          className="badge-candi"
          src="/assets/candilicious-badge.svg"
          label="CANDilicious"
          delay={0.7}
          hover={{ scale: 1.15, rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
        />
        <Deco
          className="rocky"
          src="/assets/rocky-flower.svg"
          label="Rocky"
          delay={0.85}
          hover={{ scale: 1.12, rotate: 360, transition: { duration: 0.8, ease: "easeInOut" } }}
        />

        <div className="deco arrow">
          <motion.img
            src="/assets/arrow-doodle.svg"
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
        </div>

        <Deco
          className="sticker"
          src="/assets/playground-sticker.svg"
          delay={0.95}
          hover={{ scale: 1.1, rotate: 360, transition: { duration: 1, ease: "linear" } }}
        />
        </div>
      </div>
    </section>
  );
}

function Tile({ bg, h, img, alt, quote, color }) {
  return (
    <motion.div
      className={`tile ${h}${quote ? " text" : ""}`}
      style={{ background: bg }}
      variants={fadeUp}
      whileHover="hover"
    >
      {quote ? (
        <motion.p
          className="tile-quote"
          style={{ color }}
          variants={{ hover: { scale: 1.06 } }}
          transition={{ duration: 0.35, ease }}
        >
          {quote}
        </motion.p>
      ) : (
        <motion.img
          src={img}
          alt={alt}
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 0.45, ease }}
        />
      )}
    </motion.div>
  );
}

function Benefit() {
  return (
    <section className="benefit">
      <motion.div className="benefit-head" variants={stagger(0.1)} {...reveal}>
        <motion.div variants={fadeUp}>
          <div className="eyebrow">Benefit</div>
          <h2 className="benefit-title">Your gut knows, so does your Candy</h2>
        </motion.div>
        <motion.button className="btn btn-lilac" variants={fadeUp} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
          Browse more →
        </motion.button>
      </motion.div>

      <motion.div className="grid" variants={stagger(0.1)} {...reveal}>
        <div className="col">
          <Tile bg="var(--t5)" h="h244" img="/assets/grid-ribbon.png" alt="Sour ribbon candy" />
          <Tile bg="var(--t1)" h="h500" img="/assets/grid-bubblegum.png" alt="Bubblegum" />
        </div>
        <div className="col">
          <Tile bg="var(--t2)" h="h244" quote="One candy a day makes the mind rich, and the body strong!" color="#600023" />
          <Tile bg="var(--periwinkle)" h="h244" img="/assets/grid-candyland.png" alt="Candy landscape" />
          <Tile bg="var(--t3)" h="h244" quote="Join the free club for access to healthy candies and gum." color="#663e00" />
        </div>
        <div className="col">
          <Tile bg="var(--t4)" h="h500" img="/assets/grid-peppermint.png" alt="Peppermint candy" />
          <Tile bg="var(--t1)" h="h244" img="/assets/grid-lolly.png" alt="Lollipop in the clouds" />
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  const cols = [
    ["For Treats", ["Shop Candy", "Catering", "Monthly Club", "Gift Carts"]],
    ["For Events", ["Book a Cart", "Corporate Events", "Weddings", "Party Packages"]],
    ["Important Stuff", ["FAQs", "Contact Us", "Privacy Policy"]],
  ];
  return (
    <footer>
      <motion.div className="f-menu" variants={stagger(0.12)} {...reveal}>
        {cols.map(([title, items]) => (
          <motion.div className="f-col" variants={fadeUp} key={title}>
            <h4>{title}</h4>
            <ul>
              {items.map((it) => (
                <li key={it}>
                  <a href="#">{it}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
        <motion.div className="newsletter" variants={fadeUp}>
          <h4>Join the Newsletter</h4>
          <p>Sweet deals straight to your inbox. Loved by 5k+ candy lovers and counting!</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email Address" />
            <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              Join →
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <motion.div
        className="bigword"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
      >
        candi-licious
      </motion.div>
      <div className="copyright">Copyright Candilicious LLC 2026 · Site Credit · Candilicious</div>
    </footer>
  );
}

function Splash() {
  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="hero-bg" />
      <motion.img
        className="splash-sticker"
        src="/assets/playground-sticker.svg"
        alt=""
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.25 }}
      />
      <motion.div
        className="splash-flower"
        initial={{ scale: 0, rotate: 40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
      >
        <img src="/assets/rocky-flower.svg" alt="" />
        <span>Rocky</span>
      </motion.div>
      <div className="splash-center">
        <motion.div
          className="splash-logo"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 13 }}
        >
          CANDi
        </motion.div>
        <motion.div
          className="splash-sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
        >
          The Swedish Candy Cart
        </motion.div>
      </div>
    </motion.div>
  );
}

function Site() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease }}>
      <div className="announce">Candy club is getting booked until July! Join the project waitlist →</div>
      <Nav />
      <Hero />
      <div className="stripe" />
      <Benefit />
      <Footer />
    </motion.div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{showSplash && <Splash key="splash" />}</AnimatePresence>
      {!showSplash && <Site />}
    </>
  );
}
