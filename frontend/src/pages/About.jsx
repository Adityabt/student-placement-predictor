import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  animate,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useReducedMotion,
  useInView,
  useTransform,
} from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  FiCpu,
  FiLayout,
  FiCloud,
  FiChevronDown,
  FiZap,
  FiTrendingUp,
  FiTrendingDown,
  FiEdit3,
  FiServer,
  FiEye,
  FiCheckCircle,
  FiMail,
} from "react-icons/fi";
import GlowCard from "../components/GlowCard";
import SectionDivider from "../components/SectionDivider";
import { stagger, fadeUp } from "../lib/motionVariants";

const EASE = [0.16, 1, 0.3, 1];

/* ---------------------------------------------------------------------- */
/*  Content                                                                */
/* ---------------------------------------------------------------------- */

const headlineLines = [
  { text: "The engineering", gradient: false },
  { text: "behind HireSense.", gradient: true },
];

const quickStats = [
  { label: "Training profiles", value: 15200, suffix: "+" },
  { label: "Model features", value: 16 },
  { label: "Approaches evaluated", value: 5 },
  { label: "Contributors", value: 2 },
];

const journeySteps = [
  {
    title: "Prototype",
    description: "Initial dashboard built in Streamlit to validate the core prediction concept.",
  },
  {
    title: "Full-stack rebuild",
    description: "Migrated to a React and FastAPI architecture to support a production-grade interface.",
  },
  {
    title: "Feature engineering overhaul",
    description: "Replaced composite indices with 16 granular, unencoded features to preserve model signal.",
  },
  {
    title: "Model selection & tuning",
    description: "Benchmarked five algorithms and tuned the final CatBoost model via Bayesian optimization.",
  },
];

const pipeline = [
  { icon: FiEdit3, label: "Profile Input" },
  { icon: FiServer, label: "FastAPI" },
  { icon: FiCpu, label: "CatBoost Model", core: true },
  { icon: FiEye, label: "SHAP Explainer" },
  { icon: FiCheckCircle, label: "Prediction + Insights" },
];

const stack = [
  {
    category: "ML & Backend",
    icon: FiCpu,
    items: ["CatBoost", "SHAP", "Optuna", "FastAPI", "scikit-learn", "pandas", "joblib"],
  },
  {
    category: "Frontend",
    icon: FiLayout,
    items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Recharts"],
  },
  {
    category: "Deployment",
    icon: FiCloud,
    items: ["Render", "Vercel"],
  },
];

const modelComparison = [
  { name: "Logistic Regression", accuracy: 83.2 },
  { name: "LightGBM", accuracy: 84.2 },
  { name: "Random Forest", accuracy: 84.4 },
];

// TODO: swap placeholder LinkedIn/email links for the real ones before deploy.
const contributors = [
  {
    name: "Aditya Thakur",
    title: "ML & Backend Engineer",
    contributions: [
      "Designed and tuned the CatBoost prediction pipeline using Optuna (50-trial Bayesian search)",
      "Built the FastAPI backend, including the SHAP-based explainability layer",
      "Developed the Analysis dashboard and deployed the backend to Render",
    ],
    github: "https://github.com/Adityabt",
    linkedin: "https://linkedin.com/in/adityabt",
    email: "mailto:adityabt24@gmail.com",
  },
  {
    name: "Jiya",
    title: "Data & Frontend Engineer",
    contributions: [
      "Cleaned and engineered the training dataset across 15,200+ student profiles",
      "Built the prediction form and personalized result interface",
      "Refined the navigation and hero experience, deployed the frontend to Vercel",
    ],
    github: "https://github.com/jiyagithub",
    linkedin: "https://www.linkedin.com/in/jiya0106/",
    email: "mailto:jiya.ebox@gmail.com",
  },
];

/* ---------------------------------------------------------------------- */
/*  Shared premium chrome — mirrors AnalysisSection.jsx                   */
/* ---------------------------------------------------------------------- */

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400"
      style={{ scaleX }}
    />
  );
}

// Tiny drifting motes — adds ambient depth without competing with the blobs.
function FloatingParticles({ count = 18 }) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 14 + Math.random() * 16,
        delay: Math.random() * 8,
        drift: 20 + Math.random() * 40,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [count],
  );

  if (reduceMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bg-purple-300 rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -p.drift, 0],
            x: [0, p.drift * 0.35, 0],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AmbientBackground() {
  const reduceMotion = useReducedMotion();
  const blobs = [
    { color: "rgba(168,85,247,0.16)", top: "4%", left: "-12%", size: 520 },
    { color: "rgba(236,72,153,0.12)", top: "32%", right: "-14%", size: 600 },
    { color: "rgba(99,102,241,0.14)", bottom: "-6%", left: "18%", size: 480 },
  ];
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
      <div className="absolute inset-0 bg-[#07070c]" />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[110px]"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            background: b.color,
          }}
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.06, 0.97, 1] }
          }
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <FloatingParticles />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function TiltCard({ children, intensity = 8, className = "" }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * intensity);
    rotateX.set(-py * intensity);
  };
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        perspective: 1000,
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
      }}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

function RadialGauge({ value, size = 140, stroke = 10, pulse = false, label = "Accurate" }) {
  const reduceMotion = useReducedMotion();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      delay: 0.15,
      ease: EASE,
      onUpdate: (v) => setProgress(v),
    });
    return () => controls.stop();
  }, [value]);
  const offset = circumference - (progress / 100) * circumference;
  // Position of the little orbiting marker at the tip of the arc
  const angle = (progress / 100) * 360 - 90;
  const markerX = size / 2 + radius * Math.cos((angle * Math.PI) / 180);
  const markerY = size / 2 + radius * Math.sin((angle * Math.PI) / 180);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale: hovered ? 1.04 : 1 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {pulse && !reduceMotion && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 24,
            height: size + 24,
            background:
              "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* slow-rotating dashed halo, purely decorative */}
      {!reduceMotion && (
        <motion.div
          className="absolute border border-dashed rounded-full border-purple-400/15"
          style={{ width: size + 44, height: size + 44 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
      )}
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <defs>
          <linearGradient id="aboutGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#aboutGaugeGradient)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          animate={{ strokeWidth: hovered ? stroke + 2 : stroke }}
          transition={{ duration: 0.25, ease: EASE }}
        />
      </svg>
      {/* glowing tip marker that travels with the arc as it fills */}
      {!reduceMotion && progress > 1 && (
        <motion.div
          className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-pink-300 rounded-full"
          style={{
            left: markerX,
            top: markerY,
            boxShadow: "0 0 10px 3px rgba(244,114,182,0.7)",
          }}
        />
      )}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-white tabular-nums">
          {progress.toFixed(1)}%
        </span>
        <span className="mt-0.5 text-[9px] tracking-widest text-gray-500 uppercase">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function CountUp({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);
  const text =
    decimals === 0 ? Math.round(display).toLocaleString() : display.toFixed(decimals);
  return (
    <span ref={ref} className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

function MarginChip({ delta, label }) {
  const positive = delta >= 0;
  const Icon = positive ? FiTrendingUp : FiTrendingDown;
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tabular-nums"
      style={{
        background: positive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
        color: positive ? "#4ade80" : "#f87171",
      }}
    >
      <Icon size={11} />
      {Math.abs(delta).toFixed(1)} pts {label}
    </motion.span>
  );
}

/* ---------------------------------------------------------------------- */
/*  Section-specific pieces                                               */
/* ---------------------------------------------------------------------- */

function JourneyStep({ step, index }) {
  return (
    <TiltCard className="h-full">
      <GlowCard className="h-full">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="relative h-full p-6 overflow-hidden"
        >
          <span className="absolute select-none pointer-events-none -top-3 -right-1 text-7xl font-bold text-white/[0.035]">
            {`0${index + 1}`}
          </span>
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative flex items-center justify-center w-10 h-10 mb-4 border rounded-xl bg-purple-500/10 border-purple-500/20"
          >
            <span className="text-sm font-bold text-purple-400">{index + 1}</span>
          </motion.div>
          <h3 className="relative mb-2 text-sm font-semibold text-white">{step.title}</h3>
          <p className="relative text-xs leading-relaxed text-gray-500">{step.description}</p>
        </motion.div>
      </GlowCard>
    </TiltCard>
  );
}

// Request-lifecycle diagram — shows how a single prediction actually
// moves through the system. Same "grid + absolute connecting line"
// technique used for the Journey timeline, just with icon nodes instead
// of numbered cards. A traveling packet now animates continuously along
// the connecting line to suggest a live request in flight.
function PipelineFlow({ steps }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative grid grid-cols-5 gap-1 mb-2 sm:gap-2">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
        style={{ transformOrigin: "left" }}
        className="absolute top-[22px] left-[10%] right-[10%] h-px bg-gradient-to-r from-purple-500/40 via-pink-500/50 to-purple-500/40"
      />
      {!reduceMotion && (
        <motion.div
          className="absolute top-[19px] w-1.5 h-1.5 rounded-full bg-pink-300"
          style={{
            left: "10%",
            boxShadow: "0 0 8px 2px rgba(244,114,182,0.8)",
          }}
          animate={{ left: ["10%", "90%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.6,
            delay: 1.3,
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: "easeInOut",
          }}
        />
      )}
      {steps.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ y: -2 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: EASE }}
          className="relative flex flex-col items-center gap-2"
        >
          <div
            className={`relative flex items-center justify-center w-11 h-11 rounded-full border shrink-0 transition-shadow duration-300 ${
              s.core
                ? "bg-gradient-to-br from-purple-500/25 to-pink-500/25 border-purple-400/40"
                : "bg-purple-500/10 border-purple-500/20 hover:border-purple-400/40"
            }`}
          >
            {s.core && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: ["0 0 0 0 rgba(168,85,247,0.35)", "0 0 0 8px rgba(168,85,247,0)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <s.icon className="text-purple-300" size={16} />
          </div>
          <span className="text-[9px] text-gray-500 text-center leading-tight px-0.5">
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function StackCategoryRow({ category, icon: Icon, items, i }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className="py-4 border-b first:pt-0 last:pb-0 border-white/5 last:border-b-0"
    >
      <div
        className="flex items-center justify-between cursor-pointer select-none group"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="flex items-center gap-3 text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex items-center justify-center w-8 h-8 border rounded-lg bg-purple-500/10 border-purple-500/20"
          >
            <Icon className="text-purple-400" size={14} />
          </motion.div>
          {category}
          <span className="text-xs font-normal text-gray-600">
            {items.length} tool{items.length === 1 ? "" : "s"}
          </span>
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="text-gray-600 group-hover:text-gray-400"
        >
          <FiChevronDown size={14} />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger(0.04)}
              className="flex flex-wrap gap-2 pt-3 pb-1 pl-11"
            >
              {items.map((item) => (
                <motion.span
                  key={item}
                  variants={fadeUp}
                  whileHover={{ scale: 1.06, borderColor: "rgba(168,85,247,0.4)" }}
                  transition={{ duration: 0.15 }}
                  className="text-xs text-gray-300 bg-gray-950/80 border border-white/10 px-3 py-1.5 rounded-full"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ModelBar({ name, accuracy, i, highlight, badge }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={`flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg ${
        highlight ? "bg-purple-500/5" : "hover:bg-white/[0.03]"
      }`}
    >
      <span
        className={`w-36 text-xs font-medium truncate shrink-0 ${
          highlight ? "text-white" : "text-gray-300"
        }`}
      >
        {name}
        {badge && (
          <span className="ml-1.5 text-[9px] font-semibold tracking-wider text-purple-400 uppercase">
            {badge}
          </span>
        )}
      </span>
      <div className="relative flex-1 h-1.5 overflow-hidden rounded-full bg-gray-800/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${accuracy}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
          className={`relative h-full rounded-full overflow-hidden ${
            highlight
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-gray-600"
          }`}
        >
          {highlight && (
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "220%"] }}
              transition={{
                duration: 2.2,
                delay: 1.2,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      </div>
      <span
        className={`text-xs text-right w-12 tabular-nums shrink-0 ${
          highlight ? "font-semibold text-white" : "text-gray-500"
        }`}
      >
        {accuracy.toFixed(1)}%
      </span>
    </motion.div>
  );
}

function ContactLink({ href, icon: Icon, label }) {
  return (
    <motion.a
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.92 }}
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors border rounded-full border-white/10 bg-white/[0.02] hover:text-purple-300 hover:border-purple-500/30 hover:bg-purple-500/10"
    >
      <Icon size={13} />
    </motion.a>
  );
}

function ContributorCard({ c }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div variants={fadeUp} className="h-full">
      <TiltCard className="h-full">
        <GlowCard className="h-full">
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                {/* slow-rotating gradient ring behind the initial badge */}
                {!reduceMotion && (
                  <motion.div
                    className="absolute inset-[-3px] rounded-full opacity-70"
                    style={{
                      background:
                        "conic-gradient(from 0deg, rgba(168,85,247,0.7), rgba(236,72,153,0.7), rgba(168,85,247,0))",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <div className="relative flex items-center justify-center w-12 h-12 border rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                  <span className="text-base font-bold text-purple-300">{c.name[0]}</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-white truncate">{c.name}</p>
                <p className="text-xs text-purple-300">{c.title}</p>
              </div>
            </div>

            <ul className="mb-5 space-y-2.5">
              {c.contributions.map((item, idx) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * idx, duration: 0.3, ease: EASE }}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-400"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="flex items-center gap-2 pt-4 mt-auto border-t border-white/5">
              <ContactLink href={c.github} icon={FaGithub} label={`${c.name} on GitHub`} />
              <ContactLink href={c.linkedin} icon={FaLinkedin} label={`${c.name} on LinkedIn`} />
              <ContactLink href={c.email} icon={FiMail} label={`Email ${c.name}`} />
            </div>
          </div>
        </GlowCard>
      </TiltCard>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Page entry point                                                      */
/* ---------------------------------------------------------------------- */

export default function About() {
  const sectionRef = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,0.08), transparent 70%)`;
  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const runnerUp = [...modelComparison].sort((a, b) => b.accuracy - a.accuracy)[0];
  const productionAccuracy = 84.7;
  const margin = productionAccuracy - runnerUp.accuracy;

  return (
    <div className="relative min-h-screen px-6 pb-20 pt-28">
      <AmbientBackground />
      <ScrollProgressBar />

      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div ref={sectionRef} onMouseMove={handleMouseMove} className="relative">
          <motion.div
            className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: spotlight }}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-2 text-xs font-medium text-purple-400 uppercase"
            >
              About HireSense
            </motion.p>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
              {headlineLines.map((line, i) => (
                <motion.span
                  key={line.text}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    delay: 0.1 + i * 0.15,
                    duration: 0.5,
                    ease: EASE,
                  }}
                  className={
                    line.gradient
                      ? "inline-block py-1 ml-2 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text bg-[length:200%_auto] animate-[gradientShift_6s_ease-in-out_infinite]"
                      : "inline-block text-white"
                  }
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="max-w-lg mx-auto mt-3 text-xs leading-relaxed text-gray-500"
            >
              HireSense estimates placement readiness using a tuned CatBoost
              model trained on over 15,000 student profiles, paired with
              SHAP-based explanations that surface exactly which factors are
              driving each prediction.
            </motion.p>
          </motion.div>

          {/* Overview card — mirrors the Analysis page's dataset summary card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <TiltCard>
              <GlowCard>
                <div className="flex flex-col sm:flex-row">
                  <div className="flex items-center justify-center p-5 sm:w-56 sm:p-6 shrink-0">
                    <RadialGauge value={productionAccuracy} pulse />
                  </div>
                  <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-white/10">
                    <div className="grid grid-cols-2 p-5 mt-12 ml-3 gap-x-8 gap-y-5 sm:grid-cols-4 sm:p-6">
                      {quickStats.map((s) => (
                        <motion.div
                          key={s.label}
                          whileHover={{ scale: 1.04, y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-xl font-semibold text-white">
                            <CountUp value={s.value} suffix={s.suffix || ""} />
                          </div>
                          <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                            {s.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 px-5 pt-3 pb-4 border-t sm:px-6 border-white/5">
                  <FiZap className="mt-0.5 text-purple-400 shrink-0" size={12} />
                  <p className="text-xs leading-relaxed text-gray-400">
                    Held-out test accuracy, measured on profiles excluded
                    from training — the standard measure of real-world
                    generalization.
                  </p>
                </div>
              </GlowCard>
            </TiltCard>
          </motion.div>
        </div>

        {/* Development Timeline */}
        <SectionDivider label="The Journey" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Development timeline</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            HireSense evolved through several iterations before reaching its
            current architecture.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger(0.1)}
          className="relative grid gap-4 mb-20 md:grid-cols-4"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{ transformOrigin: "left" }}
            className="absolute hidden h-px md:block top-10 left-[12%] right-[12%] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
          />
          {journeySteps.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} className="h-full">
              <JourneyStep step={step} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {/* System Architecture */}
        <SectionDivider label="The Stack" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">System architecture</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            How a request moves through the system, and the technologies
            powering each layer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <TiltCard>
            <GlowCard>
              <div className="p-4 md:p-6">
                <p className="mb-6 text-[11px] font-semibold tracking-wider text-gray-600 uppercase">
                  Request lifecycle
                </p>
                <PipelineFlow steps={pipeline} />

                <p className="pt-6 mb-4 text-[11px] font-semibold tracking-wider text-gray-600 uppercase border-t border-white/5">
                  Technology layers
                </p>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={stagger(0.06)}
                >
                  {stack.map((s, i) => (
                    <StackCategoryRow
                      key={s.category}
                      category={s.category}
                      icon={s.icon}
                      items={s.items}
                      i={i}
                    />
                  ))}
                </motion.div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>

        {/* Model Evaluation */}
        <SectionDivider label="The Numbers" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Model evaluation</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            Five modeling approaches were benchmarked on held-out data before
            selecting a production model.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <TiltCard>
            <GlowCard>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-semibold tracking-wide text-white uppercase">
                    Accuracy by approach
                  </h3>
                  <MarginChip delta={margin} label="vs next best" />
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={stagger(0.06)}
                >
                  {modelComparison.map((m, i) => (
                    <ModelBar key={m.name} name={m.name} accuracy={m.accuracy} i={i} />
                  ))}
                  <ModelBar
                    name="CatBoost"
                    accuracy={productionAccuracy}
                    i={modelComparison.length}
                    highlight
                    badge="Production"
                  />
                </motion.div>

                <p className="pt-4 mt-4 text-xs leading-relaxed text-gray-600 border-t border-white/5">
                  CatBoost was selected for its native categorical feature
                  handling and consistently stronger generalization on
                  unseen profiles, with hyperparameters tuned via Optuna's
                  Bayesian search rather than default configuration.
                </p>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>

        {/* Engineering Team */}
        <SectionDivider label="The Team" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Engineering team</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            Two contributors covering the full stack, from data pipeline and
            modeling to interface and deployment.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.15)}
          className="grid gap-5 mb-10 md:grid-cols-2"
        >
          {contributors.map((c) => (
            <ContributorCard key={c.name} c={c} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs text-center text-gray-600"
        >
          Actively maintained and iterated across data, modeling, and interface design.
        </motion.p>

      </div>

      {/* Keyframes for the shifting gradient headline — scoped locally */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
