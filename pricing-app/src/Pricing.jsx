import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  animate,
} from "framer-motion";

/* Premium, Linear/Stripe-style easing */
const EASE = [0.22, 1, 0.36, 1];

/* Staggered fade-up for the heading + toggle (refined, fast, on load) */
const HEAD_ITEM = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: 0.05 + i * 0.09 },
  }),
};

/* Per-plan theme — colors taken verbatim from the Figma "Cards on hover" frame */
const PLANS = [
  {
    id: "essential",
    name: "Essential plan",
    desc: "Perfect for small teams handling payments and transfers daily.",
    monthly: 249,
    yearly: 199,
    badge: "Billed annually — save 15%",
    theme: { wrapper: "#cad3fb", badgeBg: "#edf0ff", badgeText: "#335cff", check: "#335cff" },
  },
  {
    id: "advanced",
    name: "Advanced",
    desc: "For small teams and startups sending, receiving and managing global payments.",
    monthly: 449,
    yearly: 359,
    badge: "Billed annually — save 25%",
    theme: { wrapper: "#ccfbca", badgeBg: "#e5ffe4", badgeText: "#0c8607", check: "#0c8607" },
  },
  {
    id: "global",
    name: "Global plan",
    desc: "Built for scaling companies with finance teams and compliance needs.",
    monthly: 549,
    yearly: 439,
    badge: "Billed annually — save 45%",
    theme: { wrapper: "#f0cafb", badgeBg: "#fbecff", badgeText: "#c10ef2", check: "#c10ef2" },
  },
];

const FEATURES = [
  "Up to 10 team seats",
  "Role-based permissions",
  "Tracking dashboard",
  "Payment scheduling",
  "Priority email support",
  "Monthly finance reports",
];

function CheckIcon({ color }) {
  return (
    <svg className="check" style={{ color }} viewBox="0 0 13 13" width="13" height="13" fill="none" aria-hidden="true">
      <path
        d="M6.5 13C2.91005 13 0 10.0899 0 6.5C0 2.91005 2.91005 0 6.5 0C10.0899 0 13 2.91005 13 6.5C13 10.0899 10.0899 13 6.5 13ZM5.85195 9.1L10.4474 4.50385L9.52835 3.58475L5.85195 7.2618L4.0131 5.42295L3.094 6.34205L5.85195 9.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Animated price that tweens the number instead of snapping */
function Price({ value, reduced }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 0.42,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduced, mv]);

  return <p className="card__amount">${display}</p>;
}

function PricingCard({ plan, period, reduced }) {
  const [hovered, setHovered] = useState(false);
  const t = plan.theme;
  const price = period === "yearly" ? plan.yearly : plan.monthly;

  return (
    <motion.li
      className="card-slot"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
    >
      <motion.div
        className="card-unit"
        data-hovered={hovered}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onTap={(e) => {
          if (e.pointerType === "touch") setHovered((h) => !h);
        }}
        animate={{
          y: hovered && !reduced ? -6 : 0,
          backgroundColor: hovered ? t.wrapper : t.wrapper + "00",
          paddingTop: hovered ? 4 : 0,
          paddingRight: hovered ? 4 : 0,
          paddingBottom: hovered ? 4 : 0,
          paddingLeft: hovered ? 4 : 0,
          boxShadow: hovered
            ? "0 18px 32px -12px rgba(23,23,23,0.18), 0 6px 10px -4px rgba(23,23,23,0.08), 0 0 0 1px rgba(23,23,23,0.03)"
            : "0 0px 0px 0px rgba(23,23,23,0)",
        }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ ["--c-check"]: t.check }}
      >
        {/* Top badge — height/opacity animate in on hover */}
        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              className="badge-big"
              initial={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              animate={{ height: "auto", opacity: 1, paddingTop: 8, paddingBottom: 8 }}
              exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
            >
              <span
                className="badge"
                style={{ background: t.badgeBg, color: t.badgeText, paddingLeft: 8, paddingRight: 10 }}
              >
                {plan.badge}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card">
          <div className="card__content">
            <div className="card__title">
              <motion.p
                className="card__name"
                animate={{ fontSize: hovered ? 20 : 18, letterSpacing: hovered ? "-0.22px" : "-0.198px" }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {plan.name}
              </motion.p>
              <p className="card__desc">{plan.desc}</p>
            </div>

            <div className="card__price">
              <Price value={price} reduced={reduced} />
              <div className="card__pricedetail">
                <p className="card__per">monthly</p>
                <p className="card__billed">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={period}
                      initial={reduced ? false : { opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 1 } : { opacity: 0, y: -3 }}
                      transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
                      style={{ display: "inline-block" }}
                    >
                      {period === "yearly" ? "billed annually" : "billed monthly"}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
            </div>

            <a className="btn" href="#">Start free trial</a>
          </div>

          <hr className="card__divider" />

          <div className="card__features">
            {FEATURES.map((f) => (
              <div className="feature" key={f}>
                <CheckIcon color={hovered ? t.check : "#335cff"} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function Pricing() {
  const reduced = useReducedMotion();
  const [period, setPeriod] = useState("monthly");

  return (
    <section className="pricing">
      <div className="pricing__card">
        <div className="pricing__inner">

          {/* Heading + toggle — staggered fade-up on load */}
          <motion.div
            className="pricing__head"
            initial={reduced ? false : "hidden"}
            animate="show"
            variants={{ hidden: {}, show: {} }}
          >
            {/* Hero */}
            <div className="hero">
              <div className="hero__titlewrap">
                <motion.span className="badge" variants={HEAD_ITEM} custom={0}>
                  Plans &amp; Pricing
                </motion.span>
                <motion.h1 className="hero__title" variants={HEAD_ITEM} custom={1}>
                  Flexible pricing for growing banks
                </motion.h1>
              </div>
              <motion.p className="hero__subtitle" variants={HEAD_ITEM} custom={2}>
                Optimize payment accuracy and manage <strong>transfers with secure workflows.</strong>
              </motion.p>
            </div>

            {/* Toggle */}
            <motion.div className="toggle-row" variants={HEAD_ITEM} custom={3}>
            <div className="toggle" role="tablist" aria-label="Billing period">
              {["monthly", "yearly"].map((p) => (
                <button
                  key={p}
                  className="toggle__btn"
                  role="tab"
                  aria-selected={period === p}
                  onClick={() => setPeriod(p)}
                >
                  {period === p && (
                    <motion.span
                      className="toggle__pill"
                      layoutId="toggle-pill"
                      transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {p === "monthly" ? "Monthly" : "Yearly"}
                  </span>
                </button>
              ))}
            </div>
            <div className="save" aria-hidden="true">
              <svg viewBox="0 0 21.0001 14.1827" fill="none" preserveAspectRatio="none">
                <path
                  d="M0.0656202 13.4351C-0.0710514 13.6751 0.0126715 13.9804 0.25262 14.117C0.492569 14.2537 0.797881 14.17 0.934552 13.93L0.500086 13.6826L0.0656202 13.4351ZM20.8536 4.03553C21.0489 3.84027 21.0489 3.52369 20.8536 3.32843L17.6717 0.146447C17.4764 -0.0488155 17.1598 -0.0488155 16.9646 0.146447C16.7693 0.341709 16.7693 0.658291 16.9646 0.853554L19.793 3.68198L16.9646 6.51041C16.7693 6.70567 16.7693 7.02225 16.9646 7.21751C17.1598 7.41278 17.4764 7.41278 17.6717 7.21751L20.8536 4.03553ZM0.500086 13.6826L0.934552 13.93C3.18593 9.97739 10.182 4.18198 20.5001 4.18198V3.68198V3.18198C9.81815 3.18198 2.4926 9.17416 0.0656202 13.4351L0.500086 13.6826Z"
                  fill="currentColor"
                />
              </svg>
              <span>Save 20%</span>
            </div>
            </motion.div>
          </motion.div>

          {/* Cards */}
          <motion.ul
            className="cards"
            initial={reduced ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            {PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} period={period} reduced={reduced} />
            ))}
          </motion.ul>

          {/* Footer */}
          <p className="pricing__foot">
            All plans include a 14-day free trial. No credit card required.&nbsp;{" "}
            <span className="q">Questions?</span>{" "}
            <a className="faq" href="#">See our FAQ →</a>
          </p>

        </div>
      </div>
    </section>
  );
}
