import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import axios from "axios";
import { FiZap } from "react-icons/fi";
import GlowCard from "../components/GlowCard";
import SectionDivider from "../components/SectionDivider";
import AnalysisSection from "../components/AnalysisSection";
import { stagger, fadeUp } from "../lib/motionVariants";

const API = "http://localhost:8000";
const DONUT_COLORS = [
  "#a855f7",
  "#ec4899",
  "#6366f1",
  "#22d3ee",
  "#f59e0b",
  "#34d399",
];

function catmullRomPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function fmtPct(n) {
  return Number(n).toFixed(1);
}

function generateInsights(
  dataset_summary,
  global_importance,
  branch_stats,
  cgpa_bands,
) {
  const insights = [];

  if (branch_stats.length > 1) {
    const sorted = [...branch_stats].sort(
      (a, b) => b.placement_rate - a.placement_rate,
    );
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    insights.push({
      text: `${best.branch} leads at ${fmtPct(best.placement_rate)}% — ${worst.branch} trails at ${fmtPct(worst.placement_rate)}%, the widest gap in the dataset.`,
    });
  }

  if (cgpa_bands.length > 1) {
    const bottom = cgpa_bands[0];
    const top = cgpa_bands[cgpa_bands.length - 1];
    if (bottom.placement_rate > 0) {
      const multiplier = (top.placement_rate / bottom.placement_rate).toFixed(
        1,
      );
      insights.push({
        text: `Students in the ${top.range} CGPA range are placed at ${multiplier}× the rate of the ${bottom.range} range.`,
      });
    }
  }

  if (global_importance.length > 1) {
    const sorted = [...global_importance].sort(
      (a, b) => b.importance - a.importance,
    );
    const top = sorted[0];
    const second = sorted[1];
    if (second.importance > 0) {
      const ratio = (top.importance / second.importance).toFixed(1);
      insights.push({
        text: `${top.feature} outweighs every other factor, carrying ${ratio}× the influence of the next-strongest predictor, ${second.feature}.`,
      });
    }
  }

  if (branch_stats.length > 1) {
    const rates = branch_stats.map((b) => b.placement_rate);
    const spread = (Math.max(...rates) - Math.min(...rates)).toFixed(1);
    insights.push({
      text: `Placement rates span ${spread} points across branches — branch alone doesn't decide the outcome, but it meaningfully shifts the odds.`,
    });
  }

  if (cgpa_bands.length > 1) {
    let steepest = null;
    for (let i = 1; i < cgpa_bands.length; i++) {
      const delta =
        cgpa_bands[i].placement_rate - cgpa_bands[i - 1].placement_rate;
      if (!steepest || delta > steepest.delta) {
        steepest = { delta, from: cgpa_bands[i - 1], to: cgpa_bands[i] };
      }
    }
    if (steepest && steepest.delta > 0) {
      insights.push({
        text: `The sharpest rise in outcomes sits between ${steepest.from.range} and ${steepest.to.range} CGPA — a ${steepest.delta.toFixed(1)}-point jump in placement rate.`,
      });
    }
  }

  insights.push({
    text: `Every prediction is benchmarked against ${dataset_summary.total_students.toLocaleString()} verified student outcomes across ${branch_stats.length} branches.`,
  });

  return insights;
}

function AnimatedStat({ value, suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);
  const text =
    decimals === 0
      ? Math.round(display).toLocaleString()
      : display.toFixed(decimals);
  return (
    <span className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

function RadialGauge({ value, size = 150, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      delay: 0.15,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(v),
    });
    return () => controls.stop();
  }, [value]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale: hovered ? 1.04 : 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
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
          <linearGradient
            id="gaugeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          animate={{ strokeWidth: hovered ? stroke + 2 : stroke }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-white font tabular-nums">
          {fmtPct(progress)}%
        </span>
        <span className="mt-0.5 text-[9px] tracking-widest text-gray-500 uppercase">
          Placed
        </span>
      </div>
    </motion.div>
  );
}

function DonutChart({ branches, size = 160, stroke = 16 }) {
  const total = branches.reduce((s, b) => s + b.count, 0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [activeIdx, setActiveIdx] = useState(null);
  let cumulative = 0;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {branches.map((b, i) => {
          const fraction = total ? b.count / total : 0;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const dashoffset = -cumulative * circumference;
          cumulative += fraction;
          return (
            <motion.circle
              key={b.branch}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeDasharray={`${dash} ${gap}`}
              style={{ cursor: "pointer" }}
              onHoverStart={() => setActiveIdx(i)}
              onHoverEnd={() => setActiveIdx(null)}
              initial={{ strokeDashoffset: 0, opacity: 0, strokeWidth: stroke }}
              whileInView={{
                strokeDashoffset: dashoffset,
                opacity: activeIdx === null || activeIdx === i ? 1 : 0.35,
              }}
              animate={{
                strokeWidth: activeIdx === i ? stroke + 4 : stroke,
                opacity: activeIdx === null || activeIdx === i ? 1 : 0.35,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-white tabular-nums">
          {activeIdx !== null
            ? `${fmtPct((branches[activeIdx].count / total) * 100)}%`
            : branches.length}
        </span>
        <span className="mt-0.5 text-[9px] tracking-widest text-gray-500 uppercase">
          {activeIdx !== null ? branches[activeIdx].branch : "Branches"}
        </span>
      </div>
    </div>
  );
}

function BranchChip({ branch, count, total, color, i }) {
  const share = total ? (count / total) * 100 : 0;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2.5 py-1.5 px-1.5 -mx-1.5 rounded-lg hover:bg-white/[0.03]"
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="w-20 text-xs font-medium text-gray-300 truncate shrink-0">
        {branch}
      </span>
      <div className="flex-1 h-1 overflow-hidden rounded-full bg-gray-800/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${share}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-right text-gray-500 w-9 tabular-nums shrink-0">
        {fmtPct(share)}%
      </span>
    </motion.div>
  );
}

function PlacementChip({ branch, placement_rate, i }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2.5 py-1.5 px-1.5 -mx-1.5 rounded-lg hover:bg-white/[0.03]"
    >
      <span className="w-20 text-xs font-medium text-gray-300 truncate shrink-0">
        {branch}
      </span>
      <div className="flex-1 h-1 overflow-hidden rounded-full bg-gray-800/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${placement_rate}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
        />
      </div>
      <span className="text-xs text-right text-white w-9 tabular-nums shrink-0">
        {fmtPct(placement_rate)}%
      </span>
    </motion.div>
  );
}

function Bar({ label, value, max, i }) {
  return (
    <motion.div variants={fadeUp} className="mb-3 last:mb-0 group">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-300 transition-colors group-hover:text-white">
          {label}
        </span>
        <span className="font-semibold text-white ext-xs tabular-nums">
          {fmtPct(value)}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:brightness-125 transition-[filter]"
        />
      </div>
    </motion.div>
  );
}

function Sparkline({ bands, width = 500, height = 175 }) {
  const paddingX = 24;
  const paddingTop = 22;
  const paddingBottom = 28;
  const maxRate = Math.max(...bands.map((b) => b.placement_rate));
  const minRate = Math.min(...bands.map((b) => b.placement_rate));
  const range = maxRate - minRate || 1;
  const [hoverIdx, setHoverIdx] = useState(null);

  const points = bands.map((b, i) => ({
    x: paddingX + (i / (bands.length - 1)) * (width - paddingX * 2),
    y:
      height -
      paddingBottom -
      ((b.placement_rate - minRate) / range) *
        (height - paddingTop - paddingBottom),
    label: b.range,
    value: b.placement_rate,
  }));

  const linePath = catmullRomPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - paddingBottom + 8} L ${points[0].x},${height - paddingBottom + 8} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: 340 }}
      >
        <defs>
          <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sparkLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#sparkArea)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#sparkLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        {points.map((p, i) => (
          <g
            key={p.label}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{ cursor: "pointer" }}
          >
            <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
            <motion.circle
              cx={p.x}
              cy={p.y}
              fill="#fff"
              initial={{ opacity: 0, r: 3 }}
              whileInView={{ opacity: 1 }}
              animate={{ r: hoverIdx === i ? 5 : 3 }}
              viewport={{ once: true }}
              transition={{
                opacity: { delay: 0.6 + i * 0.07 },
                r: { duration: 0.15 },
              }}
            />
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="10"
              fontFamily="monospace"
            >
              {p.label}
            </text>
            {(i === 0 || i === points.length - 1 || hoverIdx === i) && (
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="600"
              >
                {fmtPct(p.value)}%
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function HoverCard({ children }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="transition-shadow duration-300 rounded-2xl hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
    >
      {children}
    </motion.div>
  );
}

function InsightsList({ insights }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger(0.08)}
      className="divide-y divide-white/5"
    >
      {insights.map((insight) => (
        <motion.div
          key={insight.text}
          variants={fadeUp}
          className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0"
        >
          <FiZap className="mt-0.5 text-purple-400 shrink-0" size={12} />
          <p className="text-xs leading-relaxed text-gray-400">
            {insight.text}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

const headlineLines = [
  { text: "Placement", gradient: false },
  { text: "Intelligence", gradient: true },
];

export default function Analysis() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const storedResult = JSON.parse(
    sessionStorage.getItem("predictionResult") || "null",
  );

  const sectionRef = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,0.08), transparent 70%)`;
  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  useEffect(() => {
    axios
      .get(`${API}/analysis`)
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 text-center">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Couldn't load analysis data
          </h2>
          <p className="text-sm text-gray-500">
            Make sure the backend server is running, then refresh this page.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  const { dataset_summary, global_importance, branch_stats, cgpa_bands } = data;
  const maxImportance = Math.max(...global_importance.map((f) => f.importance));
  const insights = generateInsights(dataset_summary, global_importance, branch_stats, cgpa_bands)
  const totalBranchCount = branch_stats.reduce((s, b) => s + b.count, 0);
  const bestBranch = [...branch_stats].sort(
    (a, b) => b.placement_rate - a.placement_rate,
  )[0];
  const rankedBranches = [...branch_stats].sort(
    (a, b) => b.placement_rate - a.placement_rate,
  );
  const topPredictor = [...global_importance].sort(
    (a, b) => b.importance - a.importance,
  )[0];
  const topCgpaBand = cgpa_bands[cgpa_bands.length - 1];
  const footerInsight = insights[1]?.text ?? insights[0]?.text;

  return (
    <div className="min-h-screen px-6 pt-20 pb-16">
      <div className="max-w-5xl mx-auto">
        <div
          ref={sectionRef}
          onMouseMove={handleMouseMove}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: spotlight }}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center"
          >
            <p className="mb-2 text-xs font-medium tracking-widest text-purple-400 uppercase">
              Analysis
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
              {headlineLines.map((line, i) => (
                <motion.span
                  key={line.text}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    delay: 0.1 + i * 0.15,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={
                    line.gradient
                      ? "inline-block py-1 ml-2 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text"
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
              className="max-w-md mx-auto mt-3 text-xs leading-relaxed text-gray-500"
            >
              Benchmarked against{" "}
              {dataset_summary.total_students.toLocaleString()} real student
              outcomes.
            </motion.p>
          </motion.div>

          {/* Status strip — gauge, ticker stats, insight */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <HoverCard>
              <GlowCard>
                <div className="flex flex-col sm:flex-row">
                  <div className="flex items-center justify-center p-5 sm:w-50 sm:p-6 shrink-0">
                    <RadialGauge value={dataset_summary.placement_rate} />
                  </div>
                  <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-white/10">
                    <div className="grid grid-cols-2 p-5 gap-x-8 gap-y-4 sm:grid-cols-3 sm:p-6">
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mt-5 text-xl font-semibold text-white">
                          <AnimatedStat
                            value={dataset_summary.total_students}
                          />
                        </div>
                        <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                          Students
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mt-5 text-xl font-semibold text-white">
                          <AnimatedStat
                            value={dataset_summary.avg_cgpa}
                            decimals={2}
                          />
                        </div>
                        <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                          Avg CGPA
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mt-5 text-xl font-semibold text-white truncate">
                          {bestBranch.branch}
                        </div>
                        <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                          Top branch
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-xl font-semibold text-white tabular-nums">
                          {fmtPct(bestBranch.placement_rate)}%
                        </div>
                        <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                          Top rate
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="col-span-2 sm:col-span-1"
                      >
                        <div className="text-xl font-semibold leading-snug text-white ">
                          {topPredictor.feature}
                        </div>
                        <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                          Top predictor
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-xl font-semibold text-white tabular-nums">
                          {fmtPct(topCgpaBand.placement_rate)}%
                        </div>
                        <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                          Top CGPA band
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                {footerInsight && (
                  <div className="flex items-start gap-2 px-5 pt-3 pb-4 border-t sm:px-6 border-white/5">
                    <FiZap
                      className="mt-0.5 text-purple-400 shrink-0"
                      size={12}
                    />
                    <p className="text-xs leading-relaxed text-gray-400">
                      {footerInsight}
                    </p>
                  </div>
                )}
              </GlowCard>
            </HoverCard>
          </motion.div>
        </div>

        {/* Row 2 — feature importance + branch composition */}
        <div className="grid items-stretch gap-4 mb-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase">
                    What matters most
                  </h2>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={stagger(0.05)}
                  >
                    {global_importance.slice(0, 5).map((f, i) => (
                      <Bar
                        key={f.feature}
                        label={f.feature}
                        value={f.importance}
                        max={maxImportance}
                        i={i}
                      />
                    ))}
                  </motion.div>
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase h-fit">
                    Branch composition
                  </h2>
                  <div className="flex items-center gap-6">
                    <DonutChart branches={branch_stats} />
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={stagger(0.04)}
                      className="flex-1 min-w-0 space-y-3"
                    >
                      {branch_stats.map((b, i) => (
                        <BranchChip
                          key={b.branch}
                          branch={b.branch}
                          count={b.count}
                          total={totalBranchCount}
                          color={DONUT_COLORS[i % DONUT_COLORS.length]}
                          i={i}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>
        </div>

        {/* Row 3 — placement by branch + CGPA trend */}
        <div className="grid gap-4 mb-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <h2 className="mb-1 text-xs font-semibold tracking-wide text-white uppercase">
                    Placement by branch
                  </h2>
                  <p className="mb-3 text-[11px] text-gray-500">
                    Ranked by outcome rate
                  </p>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={stagger(0.04)}
                  >
                    {rankedBranches.map((b, i) => (
                      <PlacementChip
                        key={b.branch}
                        branch={b.branch}
                        placement_rate={b.placement_rate}
                        i={i}
                      />
                    ))}
                  </motion.div>
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <h2 className="mb-1 text-xs font-semibold tracking-wide text-white uppercase">
                    CGPA vs placement
                  </h2>
                  <p className="mb-5 text-[11px] text-gray-500">
                    Placement likelihood climbs steadily as CGPA increases.
                  </p>
                  <Sparkline bands={cgpa_bands} />
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <h2 className="mb-4 text-xs font-semibold tracking-wide text-white uppercase">
                    Key insights
                  </h2>
                  <InsightsList insights={insights} />
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

        {storedResult && (
          <>
            <SectionDivider label="Your result" />
            <AnalysisSection result={storedResult} />
          </>
        )}
      </div>
    </div>
  );
}
