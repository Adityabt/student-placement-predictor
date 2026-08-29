import { useRef, useState, useEffect } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import GlowCard from "../components/GlowCard";
import { stagger, fadeUp } from "../lib/motionVariants";

const EASE = [0.16, 1, 0.3, 1];

const labelClass =
  "block text-gray-500 text-[10px] font-medium mb-1.5 uppercase tracking-widest";

// Same 3D-tilt treatment used on the Analysis page — kept local since
// there's no shared component file for it yet.
function TiltCard({ children, intensity = 6, className = "" }) {
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

// Count-up on mount instead of snapping straight to the final value —
// matches the animated stats used on the Hero and Analysis pages, so the
// very first score a person sees behaves the same way as every other
// number in the app.
function AnimatedValue({ value, decimals = 1 }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1,
      delay: 0.4,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, reduceMotion]);
  return <span className="tabular-nums">{display.toFixed(decimals)}</span>;
}

function MetricRow({ label, value, max = 100, accent, delay }) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <motion.div
      variants={fadeUp}
      className="py-3.5 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0"
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className={labelClass + " mb-0"}>{label}</span>
        <span
          className="text-xl font-bold tabular-nums"
          style={{ color: accent }}
        >
          <AnimatedValue value={value} />
          <span className="text-xs text-gray-600 font-medium ml-0.5">
            {max === 100 ? "%" : `/${max}`}
          </span>
        </span>
      </div>

      <div className="h-1.5 bg-gray-950/80 border border-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: EASE }}
          className="h-full rounded-full"
          style={{ background: accent }}
        />
      </div>
    </motion.div>
  );
}

export default function ResultCard({ result }) {
  const placed = result.prediction === 1;
  const confidence = result.confidence;
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,0.08), transparent 70%)`;

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const statusColor = placed ? "#4ade80" : "#f87171";
  const statusGradient = placed
    ? "linear-gradient(135deg, #15803d 0%, #22c55e 100%)"
    : "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)";

  // practical_exposure is Internships + Projects + Workshops/Certs summed
  // as a raw count (not a 0-100 score like the other two), so it gets its
  // own scale here rather than reusing max=100.
  const practicalExposure = result.engineered_scores?.practical_exposure ?? 0;
  const practicalMax = Math.max(15, Math.ceil(practicalExposure / 5) * 5);

  return (
    <section className="max-w-3xl px-6 pb-16 mx-auto">
      <div
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: spotlight }}
        />

        {/* Verdict chip + headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4"
            style={{
              background: placed
                ? "rgba(74,222,128,0.08)"
                : "rgba(248,113,113,0.08)",
              borderColor: placed
                ? "rgba(74,222,128,0.25)"
                : "rgba(248,113,113,0.25)",
            }}
          >
            {placed ? (
              <FaCheckCircle style={{ color: statusColor }} size={11} />
            ) : (
              <FaTimesCircle style={{ color: statusColor }} size={11} />
            )}
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: statusColor }}
            >
              Result
            </span>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
            <motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
              className="inline-block text-white"
            >
              {placed ? "Likely to be" : "May not be"}
            </motion.span>{" "}
            <motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
              className={
                placed
                  ? "inline-block py-1 text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text"
                  : "inline-block py-1 text-transparent bg-gradient-to-r from-red-400 via-rose-300 to-red-400 bg-clip-text"
              }
            >
              placed
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="max-w-md mx-auto mt-3 text-xs leading-relaxed text-gray-500"
          >
            {placed
              ? "Your academic record, skills, and experience point toward a strong shot at placement."
              : "Your academic record, skills, and experience suggest there's room to strengthen before placement season."}
          </motion.p>
        </motion.div>

        {/* Metrics card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TiltCard>
            <GlowCard className="h-full">
              <div className="p-5 md:p-6">
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-xs font-semibold tracking-wide text-white uppercase">
                    Score breakdown
                  </h2>
                  <span className="text-[10px] text-gray-600 tracking-wide">
                    Model output
                  </span>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger(0.08)}
                  className="mt-3"
                >
                  <MetricRow
                    label="Placement probability"
                    value={confidence}
                    max={100}
                    accent={statusGradient}
                    delay={0.35}
                  />
                  <MetricRow
                    label="Academic score"
                    value={result.engineered_scores.academic_score}
                    max={100}
                    accent="linear-gradient(90deg, #7c3aed, #a855f7)"
                    delay={0.45}
                  />
                  <MetricRow
                    label="Employability score"
                    value={result.engineered_scores.employability_score}
                    max={100}
                    accent="linear-gradient(90deg, #2563eb, #38bdf8)"
                    delay={0.55}
                  />
                  <MetricRow
                    label="Practical exposure"
                    value={practicalExposure}
                    max={practicalMax}
                    accent="linear-gradient(90deg, #059669, #34d399)"
                    delay={0.65}
                  />
                </motion.div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>

        {/* CTA — same premium gradient button as PredictForm */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4"
        >
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={() => navigate("/analysis")}
            className="group relative w-full overflow-hidden text-white py-4 rounded-xl flex items-center justify-center gap-2.5 isolate"
          >
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #5b21b6 0%, #7e22ce 45%, #a3195b 100%)",
              }}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.10] via-transparent to-black/20 pointer-events-none" />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_28px_rgba(168,85,247,0.45)]"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 20px rgba(126,34,206,0.35)",
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              <IoMdAnalytics className="text-[17px] text-white/90" />
              <span className="font-semibold text-[15px] tracking-wide">
                View full analysis
              </span>
              <motion.span
                className="text-white/60 text-[15px]"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}