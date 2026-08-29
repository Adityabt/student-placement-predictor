import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const stats = [
  { value: 15, suffix: "K+", label: "Students Analyzed" },
  { value: 85, suffix: "%", label: "Prediction Accuracy" },
  { display: "Instant", label: "Results" },
  { display: "Free", label: "No Sign Up" },
];
const signals = [
  { label: "CGPA", value: "8.4", top: "20%", delay: 0 },
  { label: "DSA", value: "Strong", top: "49%", delay: 0.3 },
  { label: "Projects", value: "04", top: "77%", delay: 0.6 },
];

function AnimatedNumber({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      delay: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function GlowButton({ to, scrollTo, primary, children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };
  const common = {
    ref,
    onMouseMove: move,
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
    whileHover: { y: -3 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
    className: primary
      ? "relative inline-flex overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-purple-900/30"
      : "relative inline-flex overflow-hidden rounded-xl border border-gray-700 px-8 py-3.5 text-gray-400 transition-colors hover:border-gray-500 hover:text-white",
  };
  const contents = (
    <>
      <span
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(140px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,${primary ? 0.22 : 0.08}), transparent 70%)`,
        }}
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </>
  );
  return scrollTo ? (
    <motion.button
      {...common}
      onClick={() =>
        document
          .getElementById(scrollTo)
          ?.scrollIntoView({ behavior: "smooth" })
      }
    >
      {contents}
    </motion.button>
  ) : (
    <Link to={to}>
      <motion.button {...common}>{contents}</motion.button>
    </Link>
  );
}

function PredictionLens() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative hidden h-[510px] w-full max-w-[580px] lg:block"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-300/15"
      />
      <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-3xl" />
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 580 510"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lens-beam" x1="0" x2="1">
            <stop stopColor="#c084fc" stopOpacity="0" />
            <stop offset=".55" stopColor="#e9d5ff" stopOpacity=".75" />
            <stop offset="1" stopColor="#f472b6" stopOpacity=".1" />
          </linearGradient>
          <radialGradient id="glass">
            <stop stopColor="#f5d0fe" stopOpacity=".3" />
            <stop offset=".6" stopColor="#a855f7" stopOpacity=".12" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[105, 250, 395].map((y, i) => (
          <g key={y}>
            <path
              d={`M72 ${y} C150 ${y}, 184 255, 274 255`}
              fill="none"
              stroke="url(#lens-beam)"
              strokeWidth="1.5"
            />
            <motion.circle
              r="3.5"
              fill={i === 1 ? "#f9a8d4" : "#c4b5fd"}
              filter="url(#glow)"
              initial={{ cx: 72, cy: y }}
              animate={{ cx: [72, 274], cy: [y, 255], opacity: [0, 1, 0] }}
              transition={{
                duration: 2.2,
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeIn",
              }}
            />
          </g>
        ))}
        <path
          d="M304 230 C375 230, 390 168, 525 126"
          fill="none"
          stroke="url(#lens-beam)"
          strokeWidth="2"
        />
        <path
          d="M304 255 C385 255, 415 255, 548 255"
          fill="none"
          stroke="url(#lens-beam)"
          strokeWidth="2.5"
        />
        <path
          d="M304 280 C375 280, 390 342, 525 385"
          fill="none"
          stroke="url(#lens-beam)"
          strokeWidth="2"
        />
        <motion.circle
          r="4"
          fill="#f9a8d4"
          filter="url(#glow)"
          animate={{ cx: [304, 548], cy: [255, 255], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.8,
            delay: 1.1,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeOut",
          }}
        />
        <circle
          cx="289"
          cy="255"
          r="116"
          fill="url(#glass)"
          stroke="#d8b4fe"
          strokeOpacity=".3"
        />
        <circle
          cx="289"
          cy="255"
          r="94"
          fill="none"
          stroke="#f0abfc"
          strokeOpacity=".3"
          strokeWidth="1.5"
        />
      </svg>
      {signals.map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
          transition={{
            opacity: { delay: 0.55 + s.delay },
            x: { delay: 0.55 + s.delay },
            y: {
              delay: s.delay,
              duration: 3.3 + s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{ top: s.top }}
          className="absolute left-[3%] -translate-y-1/2 text-left"
        >
          <span className="text-[10px] font-medium uppercase tracking-[.18em] text-gray-500">
            {s.label}
          </span>
          <span className="ml-2 text-sm font-semibold text-purple-200">
            {s.value}
          </span>
        </motion.div>
      ))}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-pink-300/45"
      />
      <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/20 bg-[#1c1128]/65 text-center shadow-[0_0_75px_rgba(192,132,252,.32)] backdrop-blur-xl">
        <span className="text-[10px] uppercase tracking-[.2em] text-purple-200/70">
          HireSense
        </span>
        <span className="mt-2 text-4xl font-bold text-white">
          <AnimatedNumber value={87} suffix="%" />
        </span>
        <span className="mt-1 text-xs text-pink-200">Placement potential</span>
      </div>
      {[
        { a: "Best fit", b: "Product teams", p: "top-[18%]" },
        { a: "Outlook", b: "Strong match", p: "top-1/2 -translate-y-1/2" },
        { a: "Next move", b: "Ship a project", p: "bottom-[18%]" },
      ].map((item, i) => (
        <motion.div
          key={item.a}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.25 + i * 0.2 }}
          className={`absolute right-[1%] ${item.p} text-left`}
        >
          <p className="text-[10px] uppercase tracking-[.18em] text-gray-500">
            {item.a}
          </p>
          <p className="mt-1 text-sm font-semibold text-pink-200">{item.b}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function HeroSection() {
  const ref = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,.14), transparent 70%)`;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const mouseMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };
  return (
    <section
      ref={ref}
      onMouseMove={mouseMove}
      className="relative flex items-center min-h-screen px-6 pb-20 overflow-hidden text-center pt-28 lg:text-left"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: spotlight }}
      />
      <div className="pointer-events-none absolute left-[7%] top-24 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[4%] top-44 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]"
      >
        <div className="max-w-3xl mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm text-purple-300 border rounded-full border-purple-500/20 bg-purple-500/10"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex w-full h-full bg-purple-400 rounded-full opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-400" />
            </span>
            Placement analysis based on your academic profile
          </motion.div>
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
            {["See Exactly", "Where You Stand", "Before Placement Season"].map(
              (line, i) => (
                <motion.span
                  key={line}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    delay: 0.3 + i * 0.25,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={
                    i === 1
                      ? "block py-1 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text"
                      : "block"
                  }
                >
                  {line}
                </motion.span>
              ),
            )}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-gray-400 md:text-xl lg:mx-0"
          >
            Your academic profile, evaluated against real placement outcomes —
            with a clear breakdown of your strengths and areas for improvement.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.5 }}
            className="flex flex-col items-center gap-4 mb-12 sm:flex-row lg:justify-start"
          >
            <GlowButton to="/predict" primary>
              Check My Placement Chances <FaArrowRight className="text-sm" />
            </GlowButton>
            <GlowButton scrollTo="how-it-works">How it works</GlowButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-stretch justify-center max-w-2xl mx-auto divide-x divide-gray-800 lg:mx-0 lg:justify-start"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex-1 px-3 first:pl-0 sm:px-4">
                <div className="text-2xl font-bold text-white">
                  {s.value != null ? (
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  ) : (
                    s.display
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <PredictionLens />
      </motion.div>
      <motion.button
        onClick={() =>
          document
            .getElementById("how-it-works")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{ opacity }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute z-10 flex flex-col items-center gap-2 text-gray-500 -translate-x-1/2 bottom-8 left-1/2 hover:text-gray-300"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <FiChevronDown />
        </motion.span>
      </motion.button>
    </section>
  );
}
