import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiZap,
  FiTrendingUp,
  FiTrendingDown,
  FiMapPin,
  FiBarChart2,
  FiCheckCircle,
  FiAlertTriangle,
  FiTarget,
  FiChevronDown,
  FiX,
  FiEye,
  FiArrowRight,
} from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import GlowCard from "../components/GlowCard";
import SectionDivider from "../components/SectionDivider";
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
const BRANCHES = ["CSE", "Civil", "ECE", "EEE", "IT", "Mechanical"];
const EASE = [0.16, 1, 0.3, 1];

const labelClass =
  "block text-gray-500 text-[10px] font-medium mb-1.5 uppercase tracking-widest";

const insightIconMap = {
  benchmark: FiTrendingUp,
  branch: FiMapPin,
  cgpa: FiBarChart2,
  predictor: FiZap,
  gap: FiAlertTriangle,
};

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

function normalizeBranch(name) {
  return (name || "").toString().trim().toLowerCase();
}

function findCgpaBand(cgpa, bands) {
  for (const band of bands) {
    const nums = String(band.range).match(/[\d.]+/g);
    if (!nums || nums.length < 2) continue;
    const [lo, hi] = nums.map(Number);
    if (cgpa >= lo && cgpa <= hi) return band;
  }
  return bands[bands.length - 1];
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

function generatePersonalInsights(result, data) {
  const inputs = result.inputs || {};
  const scores = result.engineered_scores || {};
  const confidence = result.confidence;

  const { dataset_summary, global_importance, branch_stats, cgpa_bands } = data;

  const branchName =
    typeof inputs.branch === "number" ? BRANCHES[inputs.branch] : inputs.branch;
  const cgpa = Number(inputs.cgpa) || 0;
  const backlogs = Number(inputs.backlogs) || 0;
  const projects = Number(inputs.projects) || 0;
  const internshipCount =
    inputs.internship_details?.length ?? (Number(inputs.internships) || 0);
  const certifications = inputs.certifications?.length || 0;
  const technicalSkills = inputs.technical_skills?.length || 0;
  const problemsSolved = Number(inputs.problems_solved) || 0;
  const githubRepos = Number(inputs.github_repos) || 0;
  const training = !!inputs.placement_training;

  const insights = [];
  const strengths = [];
  const gaps = [];

  const avgRate = dataset_summary.placement_rate;
  const confidenceDelta = confidence - avgRate;
  insights.push({
    type: "benchmark",
    text: `Your predicted placement probability is ${fmtPct(confidence)}%, which is ${Math.abs(confidenceDelta).toFixed(1)} points ${confidenceDelta >= 0 ? "above" : "below"} the dataset-wide average of ${fmtPct(avgRate)}%.`,
  });

  let branchRank = null;
  const branchTotal = branch_stats.length;
  const branchMatch = branch_stats.find(
    (b) => normalizeBranch(b.branch) === normalizeBranch(branchName),
  );
  if (branchMatch) {
    const ranked = [...branch_stats].sort(
      (a, b) => b.placement_rate - a.placement_rate,
    );
    branchRank =
      ranked.findIndex(
        (b) => normalizeBranch(b.branch) === normalizeBranch(branchName),
      ) + 1;
    insights.push({
      type: "branch",
      text: `${branchName} has a ${fmtPct(branchMatch.placement_rate)}% placement rate in this dataset — ranked #${branchRank} of ${branchTotal} branches.`,
    });
    if (branchMatch.placement_rate >= avgRate) {
      strengths.push(`${branchName} branch performs above the dataset average`);
    } else {
      gaps.push(`${branchName} branch performs below the dataset average`);
    }
  }

  const band = findCgpaBand(cgpa, cgpa_bands);
  if (band) {
    insights.push({
      type: "cgpa",
      text: `At a CGPA of ${cgpa.toFixed(2)}, you fall in the ${band.range} band, where students are historically placed at ${fmtPct(band.placement_rate)}%.`,
    });
    if (band.placement_rate >= avgRate) {
      strengths.push(
        `CGPA band (${band.range}) sits above the dataset average`,
      );
    } else {
      gaps.push(
        `CGPA band (${band.range}) sits below average — raising CGPA is one of the highest-leverage changes available to you`,
      );
    }
  }

  const featureKeywordMap = [
    {
      keys: ["cgpa", "academic", "gpa"],
      label: `your CGPA (${cgpa.toFixed(2)})`,
    },
    { keys: ["backlog"], label: `your backlog count (${backlogs})` },
    { keys: ["intern"], label: `your internship count (${internshipCount})` },
    { keys: ["project"], label: `your project count (${projects})` },
    { keys: ["certif"], label: `your certification count (${certifications})` },
    {
      keys: ["skill"],
      label: `your technical skill count (${technicalSkills})`,
    },
    {
      keys: ["problem", "dsa", "coding"],
      label: `problems solved (${problemsSolved})`,
    },
    { keys: ["github", "repo"], label: `GitHub repos (${githubRepos})` },
    {
      keys: ["training"],
      label: training
        ? "having completed placement training"
        : "not having completed placement training",
    },
  ];

  const sortedFeatures = [...global_importance].sort(
    (a, b) => b.importance - a.importance,
  );
  sortedFeatures.slice(0, 3).forEach((f, i) => {
    const key = f.feature.toLowerCase();
    const match = featureKeywordMap.find((m) =>
      m.keys.some((k) => key.includes(k)),
    );
    insights.push({
      type: "predictor",
      text: match
        ? `${f.feature} is ${i === 0 ? "the single strongest" : "another major"} predictor in this model — your result reflects ${match.label}.`
        : `${f.feature} is ${i === 0 ? "the single strongest" : "another major"} predictor in this model, carrying substantial weight in your final probability.`,
    });
  });

  if (backlogs === 0) {
    strengths.push("Zero active backlogs");
  } else {
    gaps.push(
      `${backlogs} backlog${backlogs > 1 ? "s" : ""} on record — clearing these typically has an outsized positive effect`,
    );
  }

  if (internshipCount > 0) {
    strengths.push(
      `${internshipCount} internship${internshipCount > 1 ? "s" : ""} completed`,
    );
  } else {
    gaps.push(
      "No internships logged — even one relevant internship meaningfully lifts employability score",
    );
  }

  if (projects >= 3) {
    strengths.push(`${projects} projects — a strong portfolio signal`);
  } else if (projects > 0) {
    gaps.push(
      `Only ${projects} project${projects > 1 ? "s" : ""} listed — 3+ is where this typically stops being a limiting factor`,
    );
  } else {
    gaps.push(
      "No projects listed — this is one of the fastest ways to move the needle",
    );
  }

  if (certifications >= 2) {
    strengths.push(`${certifications} certifications on record`);
  } else if (certifications === 0) {
    gaps.push("No certifications listed");
  }

  if (technicalSkills >= 5) {
    strengths.push(`${technicalSkills} technical skills tagged`);
  } else if (technicalSkills === 0) {
    gaps.push("No technical skills tagged on your profile");
  }

  if (problemsSolved >= 150) {
    strengths.push(`${problemsSolved} problems solved — strong DSA practice`);
  } else if (problemsSolved < 50) {
    gaps.push(
      `${problemsSolved} problems solved — dataset-wide, higher problem counts correlate with stronger outcomes`,
    );
  }

  if (training) {
    strengths.push("Completed placement training");
  } else {
    gaps.push("Placement training not completed");
  }

  const academic = scores.academic_score ?? 0;
  const employability = scores.employability_score ?? 0;
  if (Math.abs(academic - employability) > 15) {
    const academicWeaker = academic < employability;
    insights.push({
      type: "gap",
      text: `There's a real gap between your two component scores — ${academicWeaker ? "academic" : "employability"} score (${fmtPct(academicWeaker ? academic : employability)}%) is dragging behind ${academicWeaker ? "employability" : "academic"} (${fmtPct(academicWeaker ? employability : academic)}%), and is the more direct lever to pull.`,
    });
  }

  return {
    insights,
    strengths,
    gaps,
    branchRank,
    branchTotal,
    cgpaBand: band,
    confidenceDelta,
    avgRate,
  };
}

/* ---------------------------------------------------------------------- */
/*  New: page-level ambience, scroll progress, section nav                */
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
              : { x: [0, 30, -20, 0], y: [0, -25, 15, 0] }
          }
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
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

function RadarChart({ metrics, size = 240 }) {
  const reduceMotion = useReducedMotion();
  const center = size / 2;
  const maxRadius = size / 2 - 36;
  const [progress, setProgress] = useState(reduceMotion ? 1 : 0);
  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, 1, {
      duration: 1.1,
      delay: 0.2,
      ease: EASE,
      onUpdate: setProgress,
    });
    return () => controls.stop();
  }, [reduceMotion]);

  const angleStep = (Math.PI * 2) / metrics.length;
  const pointAt = (i, frac) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = maxRadius * frac;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = metrics.map((m, i) =>
    pointAt(i, Math.min(1, m.value / m.max) * progress),
  );
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ") +
    " Z";
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[260px] mx-auto"
    >
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {rings.map((r) => (
        <polygon
          key={r}
          points={metrics
            .map((_, i) => {
              const p = pointAt(i, r);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {metrics.map((m, i) => {
        const p = pointAt(i, 1);
        return (
          <line
            key={m.label}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}
      <motion.path
        d={dataPath}
        fill="url(#radarFill)"
        stroke="#c084fc"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" />
      ))}
      {metrics.map((m, i) => {
        const lp = pointAt(i, 1.18);
        return (
          <text
            key={m.label}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="#9ca3af"
            fontFamily="monospace"
          >
            {m.label}
          </text>
        );
      })}
    </svg>
  );
}

function AnimatedStat({ value, suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE,
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

function RadialGauge({ value, size = 150, stroke = 10, pulse = false }) {
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
          transition={{ duration: 0.25, ease: EASE }}
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
                ease: EASE,
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
      transition={{ duration: 0.2, ease: EASE }}
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
            ease: EASE,
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
      transition={{ duration: 0.2, ease: EASE }}
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
            ease: EASE,
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
            ease: EASE,
          }}
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:brightness-125 transition-[filter]"
        />
      </div>
    </motion.div>
  );
}

function Sparkline({
  bands,
  width = 500,
  height = 175,
  markerCgpa,
  markerValue,
}) {
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

  const allNums = bands.flatMap((b) =>
    (String(b.range).match(/[\d.]+/g) || []).map(Number),
  );
  const cgpaMin = allNums.length ? Math.min(...allNums) : 0;
  const cgpaMax = allNums.length ? Math.max(...allNums) : 10;
  let markerX = null;
  let markerY = null;
  if (markerCgpa != null && allNums.length) {
    const clampedCgpa = Math.min(cgpaMax, Math.max(cgpaMin, markerCgpa));
    markerX =
      paddingX +
      ((clampedCgpa - cgpaMin) / (cgpaMax - cgpaMin || 1)) *
        (width - paddingX * 2);
    if (markerValue != null) {
      const clampedVal = Math.min(maxRate, Math.max(minRate, markerValue));
      markerY =
        height -
        paddingBottom -
        ((clampedVal - minRate) / range) *
          (height - paddingTop - paddingBottom);
    }
  }

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
          transition={{ duration: 1, ease: EASE }}
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
              <g>
                {hoverIdx === i && (
                  <rect
                    x={p.x - 20}
                    y={p.y - 26}
                    width="40"
                    height="16"
                    rx="6"
                    fill="rgba(10,10,16,0.85)"
                    stroke="rgba(255,255,255,0.08)"
                  />
                )}
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
              </g>
            )}
          </g>
        ))}
        {markerX != null && (
          <motion.line
            x1={markerX}
            x2={markerX}
            y1={paddingTop}
            y2={height - paddingBottom}
            stroke="#facc15"
            strokeDasharray="3 3"
            strokeWidth="1.2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.4 }}
          />
        )}
        {markerX != null && markerY != null && (
          <motion.circle
            cx={markerX}
            cy={markerY}
            r="6"
            fill="#facc15"
            stroke="#0b0b12"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.4, ease: EASE }}
          />
        )}
        {markerX != null && (
          <motion.text
            x={markerX}
            y={paddingTop - 8}
            textAnchor="middle"
            fill="#facc15"
            fontSize="9"
            fontWeight="700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            YOU
          </motion.text>
        )}
      </svg>
    </div>
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
      {insights.map((insight, i) => (
        <motion.div
          key={i}
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

function PersonalInsightsList({ insights }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger(0.07)}
      className="space-y-2"
    >
      {insights.map((insight, i) => {
        const Icon = insightIconMap[insight.type] || FiZap;
        return (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3 p-3 transition-colors border rounded-xl bg-white/[0.02] border-white/5 hover:border-purple-500/20 hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-center rounded-lg w-7 h-7 bg-purple-500/10 shrink-0">
              <Icon className="text-purple-300" size={13} />
            </div>
            <p className="pt-1 text-xs leading-relaxed text-gray-300">
              {insight.text}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function SignalList({ items, tone, emptyText }) {
  const positive = tone === "positive";
  const Icon = positive ? FiCheckCircle : FiAlertTriangle;
  const iconBg = positive ? "bg-emerald-500/10" : "bg-amber-500/10";
  const iconColor = positive ? "text-emerald-300" : "text-amber-300";
  if (!items || items.length === 0) {
    return <p className="text-xs text-gray-500">{emptyText}</p>;
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger(0.05)}
      className="space-y-2"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
        >
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-lg shrink-0 ${iconBg}`}
          >
            <Icon className={iconColor} size={12} />
          </div>
          <p className="pt-0.5 text-xs leading-relaxed text-gray-300">{item}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function DeltaChip({ delta }) {
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
      {Math.abs(delta).toFixed(1)} pts vs avg
    </motion.span>
  );
}

function RankIndicator({ rank, total, label }) {
  const pct = total > 1 ? ((rank - 1) / (total - 1)) * 100 : 0;
  const color = pct <= 33 ? "#4ade80" : pct <= 66 ? "#facc15" : "#f87171";
  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-[10px] text-gray-500 uppercase tracking-widest">
        <span>Best</span>
        <span>Worst</span>
      </div>
      <div className="relative h-2 mb-4 rounded-full bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-red-500/40">
        <motion.div
          className="absolute top-1/2 w-3.5 h-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-gray-950 shadow-lg"
          style={{ background: color }}
          initial={{ left: "50%", opacity: 0 }}
          whileInView={{ left: `${pct}%`, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <p className="text-xs text-center text-gray-400">{label}</p>
    </div>
  );
}

function MiniRing({
  value,
  max,
  display,
  label,
  color,
  size = 68,
  stroke = 6,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = max > 0 ? Math.min(1, value / max) : 0;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1,
      ease: EASE,
      onUpdate: (v) => setProgress(v),
    });
    return () => controls.stop();
  }, [target]);
  const offset = circumference - progress * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeWidth={stroke}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white tabular-nums">
          {display}
        </div>
      </div>
      <span className="text-[9px] tracking-widest text-gray-500 uppercase text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function InfoStat({ label, value }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
      <div className="text-xl font-semibold text-white truncate">{value}</div>
      <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
        {label}
      </div>
    </motion.div>
  );
}

function ChipList({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger(0.03)}
        className="flex flex-wrap gap-2"
      >
        {items.map((item) => (
          <motion.span
            key={item}
            variants={fadeUp}
            className="bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-medium px-3 py-1.5 rounded-full"
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

function YourResult({ result, data }) {
  if (!result) return null;

  const placed = result.prediction === 1;
  const confidence = result.confidence;
  const inputs = result.inputs || {};
  const scores = result.engineered_scores || {};

  const statusColor = placed ? "#4ade80" : "#f87171";

  const branchName =
    typeof inputs.branch === "number" ? BRANCHES[inputs.branch] : inputs.branch;

  const cgpa = Number(inputs.cgpa) || 0;
  const backlogs = Number(inputs.backlogs) || 0;
  const projects = Number(inputs.projects) || 0;
  const internshipCount =
    inputs.internship_details?.length ?? (Number(inputs.internships) || 0);
  const certifications = inputs.certifications?.length || 0;
  const technicalSkills = inputs.technical_skills?.length || 0;
  const problemsSolved = Number(inputs.problems_solved) || 0;
  const githubRepos = Number(inputs.github_repos) || 0;
  const training = !!inputs.placement_training;

  const academic = scores.academic_score ?? 0;
  const employability = scores.employability_score ?? 0;

  const {
    insights,
    strengths,
    gaps,
    branchRank,
    branchTotal,
    cgpaBand,
    confidenceDelta,
  } = generatePersonalInsights(result, data);

  const radarMetrics = [
    { label: "CGPA", value: cgpa, max: 10 },
    { label: "Projects", value: projects, max: 6 },
    { label: "Interns", value: internshipCount, max: 3 },
    { label: "Certs", value: certifications, max: 5 },
    { label: "Skills", value: technicalSkills, max: 10 },
    { label: "DSA", value: problemsSolved, max: 300 },
  ];

  return (
    <div className="mb-8" id="your-result">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-center"
      >
        <p className="mb-2 text-xs font-medium tracking-widest text-purple-400 uppercase">
          Your Result
        </p>
        <p className="max-w-md mx-auto text-xs leading-relaxed text-gray-500">
          Here's exactly why the model landed on {fmtPct(confidence)}%.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <TiltCard>
          <GlowCard>
            <div className="flex flex-col sm:flex-row">
              <div className="flex flex-col items-center justify-center gap-3 p-5 sm:w-56 sm:p-6 shrink-0">
                <RadialGauge value={confidence} size={140} pulse />
                <DeltaChip delta={confidenceDelta} />
              </div>
              <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-white/10">
                <div className="p-5 sm:p-6">
                  <div
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
                      {placed ? "Likely to be placed" : "May not be placed"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    <InfoStat
                      label="Academic score"
                      value={`${fmtPct(academic)}%`}
                    />
                    <InfoStat
                      label="Employability score"
                      value={`${fmtPct(employability)}%`}
                    />
                    <InfoStat
                      label="Branch rank"
                      value={branchRank ? `#${branchRank}/${branchTotal}` : "—"}
                    />
                    <InfoStat
                      label="CGPA band"
                      value={cgpaBand ? cgpaBand.range : "—"}
                    />
                    <InfoStat label="Backlogs" value={backlogs} />
                    <InfoStat label="Branch" value={branchName || "—"} />
                  </div>
                </div>
              </div>
            </div>
            {insights[0] && (
              <div className="flex items-start gap-2 px-5 pt-3 pb-4 border-t sm:px-6 border-white/5">
                <FiZap className="mt-0.5 text-purple-400 shrink-0" size={12} />
                <p className="text-xs leading-relaxed text-gray-400">
                  {insights[0].text}
                </p>
              </div>
            )}
          </GlowCard>
        </TiltCard>
      </motion.div>

      {/* Where your CGPA lands / Branch standing */}
      <div className="grid gap-4 mb-4 md:grid-cols-2">
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <TiltCard className="h-full">
            <GlowCard className="h-full">
              <div className="flex flex-col h-full p-4 md:p-5">
                <h2 className="mb-1 text-xs font-semibold tracking-wide text-white uppercase">
                  Where your CGPA lands
                </h2>
                <p className="mb-4 text-[11px] text-gray-500">
                  The dot marks your predicted probability against the
                  historical CGPA trend.
                </p>
                <div className="flex-1">
                  <Sparkline
                    bands={data.cgpa_bands}
                    markerCgpa={cgpa}
                    markerValue={confidence}
                  />
                </div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>

        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <TiltCard className="h-full">
            <GlowCard className="h-full">
              <div className="flex flex-col h-full p-4 md:p-5">
                <h2 className="mb-1 text-xs font-semibold tracking-wide text-white uppercase">
                  Branch standing
                </h2>
                <p className="mb-4 text-[11px] text-gray-500">
                  {branchName || "Your branch"} ranked among all branches in the
                  dataset.
                </p>
                <div className="flex flex-col justify-center flex-1">
                  {branchRank ? (
                    <RankIndicator
                      rank={branchRank}
                      total={branchTotal}
                      label={`#${branchRank} of ${branchTotal} — ${branchName}`}
                    />
                  ) : (
                    <p className="text-xs text-gray-500">
                      Branch data unavailable.
                    </p>
                  )}
                </div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <TiltCard>
          <GlowCard>
            <div className="p-4 md:p-5">
              <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase">
                Why this result
              </h2>
              <PersonalInsightsList insights={insights} />
            </div>
          </GlowCard>
        </TiltCard>
      </motion.div>

      {/* What's helping / Where you can improve */}
      <div className="grid gap-4 mb-4 md:grid-cols-2">
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <TiltCard className="h-full">
            <GlowCard className="h-full">
              <div className="flex flex-col h-full p-4 md:p-5">
                <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase">
                  What's helping
                </h2>
                <SignalList
                  items={strengths}
                  tone="positive"
                  emptyText="No strong positives identified yet."
                />
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>

        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <TiltCard className="h-full">
            <GlowCard className="h-full">
              <div className="flex flex-col h-full p-4 md:p-5">
                <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase">
                  Where you can improve
                </h2>
                <SignalList
                  items={gaps}
                  tone="negative"
                  emptyText="No major gaps identified — well-rounded profile."
                />
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-4"
      >
        <TiltCard>
          <GlowCard>
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold tracking-wide text-white uppercase">
                  Your profile
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest">
                  <FiTarget size={11} /> Shape
                </span>
              </div>

              <div className="grid gap-6 mb-6 md:grid-cols-[240px_1fr] items-center">
                <RadarChart metrics={radarMetrics} />
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={stagger(0.05)}
                  className="grid grid-cols-3 gap-4 sm:grid-cols-4"
                >
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={cgpa}
                      max={10}
                      display={cgpa.toFixed(1)}
                      label="CGPA"
                      color={DONUT_COLORS[0]}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={projects}
                      max={6}
                      display={projects}
                      label="Projects"
                      color={DONUT_COLORS[1]}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={internshipCount}
                      max={3}
                      display={internshipCount}
                      label="Internships"
                      color={DONUT_COLORS[2]}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={certifications}
                      max={5}
                      display={certifications}
                      label="Certifications"
                      color={DONUT_COLORS[3]}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={technicalSkills}
                      max={10}
                      display={technicalSkills}
                      label="Tech skills"
                      color={DONUT_COLORS[4]}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={githubRepos}
                      max={10}
                      display={githubRepos}
                      label="GitHub repos"
                      color={DONUT_COLORS[5]}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={problemsSolved}
                      max={300}
                      display={problemsSolved}
                      label="Problems solved"
                      color="#38bdf8"
                    />
                  </motion.div>
                  <motion.div variants={fadeUp}>
                    <MiniRing
                      value={Math.max(0, 5 - backlogs)}
                      max={5}
                      display={backlogs}
                      label="Backlogs"
                      color={
                        backlogs === 0
                          ? "#4ade80"
                          : backlogs <= 2
                            ? "#facc15"
                            : "#f87171"
                      }
                    />
                  </motion.div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                  {branchName || "—"} branch
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                  {training
                    ? "Completed placement training"
                    : "No placement training yet"}
                </span>
              </div>
              <div className="space-y-4">
                <ChipList
                  label="Technical skills"
                  items={inputs.technical_skills}
                />
                <ChipList label="Soft skills" items={inputs.soft_skill_tags} />
                <ChipList
                  label="Certifications"
                  items={inputs.certifications}
                />
              </div>
            </div>
          </GlowCard>
        </TiltCard>
      </motion.div>
    </div>
  );
}

const headlineLines = [
  { text: "Placement", gradient: false },
  { text: "Intelligence", gradient: true },
];

/* ---------------------------------------------------------------------- */
/*  New: modal wrapper, pre-prediction CTA, extracted dataset overview    */
/* ---------------------------------------------------------------------- */

function Modal({ onClose, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 py-10 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="relative w-full max-w-6xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-1 pb-4">
          <p className="text-xs font-medium tracking-widest text-purple-400 uppercase">
            How this analysis works
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors border rounded-full border-white/10 bg-white/[0.04] hover:text-white hover:bg-white/[0.08]"
            aria-label="Close"
          >
            <FiX size={15} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function PredictCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <TiltCard>
        <GlowCard>
          <div className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left md:p-8">
            <div>
              <p className="mb-1 text-xs font-medium tracking-widest text-purple-400 uppercase">
                No prediction yet
              </p>
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Get your personal placement prediction first
              </h2>
              <p className="max-w-md mt-2 text-xs leading-relaxed text-gray-500">
                What you're seeing below is the dataset-wide analysis. Run
                your own prediction to see a personalized breakdown built
                around your profile.
              </p>
            </div>
            <Link to="/predict" className="shrink-0">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20"
              >
                Go to Predict
                <FiArrowRight size={13} />
              </motion.span>
            </Link>
          </div>
        </GlowCard>
      </TiltCard>
    </motion.div>
  );
}

function DefaultAnalysisContent({ data }) {
  const sectionRef = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,0.08), transparent 70%)`;
  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const { dataset_summary, global_importance, branch_stats, cgpa_bands } = data;
  const maxImportance = Math.max(...global_importance.map((f) => f.importance));
  const insights = generateInsights(
    dataset_summary,
    global_importance,
    branch_stats,
    cgpa_bands,
  );
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
    <>
      <div
        id="overview"
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
                  ease: EASE,
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
          <motion.div
            className="flex justify-center mt-6"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <FiChevronDown className="text-gray-600" size={18} />
          </motion.div>
        </motion.div>
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
                <div className="flex items-center justify-center p-5 sm:w-50 sm:p-6 shrink-0">
                  <RadialGauge value={dataset_summary.placement_rate} />
                </div>
                <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-white/10">
                  <div className="grid grid-cols-2 p-5 gap-x-8 gap-y-4 sm:grid-cols-3 sm:p-6">
                    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
                      <div className="mt-5 text-xl font-semibold text-white">
                        <AnimatedStat value={dataset_summary.total_students} />
                      </div>
                      <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                        Students
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
                      <div className="mt-5 text-xl font-semibold text-white">
                        <AnimatedStat value={dataset_summary.avg_cgpa} decimals={2} />
                      </div>
                      <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                        Avg CGPA
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
                      <div className="mt-5 text-xl font-semibold text-white truncate">
                        {bestBranch.branch}
                      </div>
                      <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                        Top branch
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
                      <div className="text-xl font-semibold text-white tabular-nums">
                        {fmtPct(bestBranch.placement_rate)}%
                      </div>
                      <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                        Top rate
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="col-span-2 sm:col-span-1">
                      <div className="text-xl font-semibold leading-snug text-white ">
                        {topPredictor.feature}
                      </div>
                      <div className="mt-1 text-[10px] tracking-wide text-gray-500 uppercase">
                        Top predictor
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
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
                  <FiZap className="mt-0.5 text-purple-400 shrink-0" size={12} />
                  <p className="text-xs leading-relaxed text-gray-400">{footerInsight}</p>
                </div>
              )}
            </GlowCard>
          </TiltCard>
        </motion.div>
      </div>

      <div id="importance" className="grid items-stretch gap-4 mb-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <TiltCard>
            <GlowCard>
              <div className="p-4 md:p-5">
                <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase">
                  What matters most
                </h2>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.05)}>
                  {global_importance.slice(0, 5).map((f, i) => (
                    <Bar key={f.feature} label={f.feature} value={f.importance} max={maxImportance} i={i} />
                  ))}
                </motion.div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>
        <motion.div id="branches" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <TiltCard>
            <GlowCard>
              <div className="p-4 md:p-5">
                <h2 className="mb-3 text-xs font-semibold tracking-wide text-white uppercase h-fit">
                  Branch composition
                </h2>
                <div className="flex items-center gap-6">
                  <DonutChart branches={branch_stats} />
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.04)} className="flex-1 min-w-0 space-y-3">
                    {branch_stats.map((b, i) => (
                      <BranchChip key={b.branch} branch={b.branch} count={b.count} total={totalBranchCount} color={DONUT_COLORS[i % DONUT_COLORS.length]} i={i} />
                    ))}
                  </motion.div>
                </div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>
      </div>

      <div className="grid gap-4 mb-4 md:grid-cols-2">
        <motion.div id="rates" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <TiltCard>
            <GlowCard>
              <div className="p-4 md:p-5">
                <h2 className="mb-1 text-xs font-semibold tracking-wide text-white uppercase">
                  Placement by branch
                </h2>
                <p className="mb-3 text-[11px] text-gray-500">Ranked by outcome rate</p>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.04)}>
                  {rankedBranches.map((b, i) => (
                    <PlacementChip key={b.branch} branch={b.branch} placement_rate={b.placement_rate} i={i} />
                  ))}
                </motion.div>
              </div>
            </GlowCard>
          </TiltCard>
        </motion.div>
        <motion.div id="cgpa" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <TiltCard>
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
          </TiltCard>
        </motion.div>
      </div>

      <motion.div id="insights" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
        <TiltCard>
          <GlowCard>
            <div className="p-4 md:p-5">
              <h2 className="mb-4 text-xs font-semibold tracking-wide text-white uppercase">
                Key insights
              </h2>
              <InsightsList insights={insights} />
            </div>
          </GlowCard>
        </TiltCard>
      </motion.div>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/*  Page entry point                                                      */
/* ---------------------------------------------------------------------- */

export default function AnalysisSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const storedResult = JSON.parse(
    sessionStorage.getItem("predictionResult") || "null",
  );

  useEffect(() => {
    axios
      .get(`${API}/analysis`)
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!showAnalysisModal) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setShowAnalysisModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [showAnalysisModal]);

  if (error) {
    return (
      <div className="relative flex items-center justify-center min-h-screen px-6 text-center">
        <AmbientBackground />
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
      <div className="relative flex items-center justify-center min-h-screen">
        <AmbientBackground />
        <div className="w-8 h-8 border-2 border-purple-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 pb-20 pt-28">
      <AmbientBackground />
      <ScrollProgressBar />

      <div className="max-w-6xl mx-auto">
        {storedResult ? (
          <div className="pt-6">
            <YourResult result={storedResult} data={data} />
            <div className="flex justify-center mb-10">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAnalysisModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-medium text-gray-300 hover:text-white hover:border-purple-500/30 hover:bg-white/[0.06] transition-colors"
              >
                <FiEye size={13} />
                See how this analysis works
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="pt-6">
            <PredictCTA />
            <SectionDivider label="Dataset Overview" />
            <DefaultAnalysisContent data={data} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAnalysisModal && (
          <Modal onClose={() => setShowAnalysisModal(false)}>
            <DefaultAnalysisContent data={data} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}