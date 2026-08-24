import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform, animate } from "framer-motion"
import { FaArrowRight } from "react-icons/fa"
import { FiChevronDown } from "react-icons/fi"
import { Link } from "react-router-dom"

const stats = [
  { value: 10, suffix: "K+", label: "Students Analyzed" },
  { value: 79, suffix: "%", label: "Prediction Accuracy" },
  { display: "Instant", label: "Results" },
  { display: "Free", label: "No Sign Up" },
]

function AnimatedNumber({ value, suffix }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      delay: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value])
  return <span>{display}{suffix}</span>
}

const headlineLines = [
  { text: "See Exactly", gradient: false },
  { text: "Where You Stand", gradient: true },
  { text: "Before Placement Season", gradient: false },
]

function GlowButton({ to, scrollTo, primary, children }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [hovering, setHovering] = useState(false)

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const className = primary
    ? "relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-purple-900/30"
    : "relative overflow-hidden inline-flex items-center gap-2 text-gray-400 hover:text-white px-8 py-3.5 rounded-xl text-base border border-gray-700 hover:border-gray-500 transition-colors"

  const glow = (
    <span
      className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
      style={{
        opacity: hovering ? 1 : 0,
        background: `radial-gradient(140px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,${primary ? 0.22 : 0.08}), transparent 70%)`,
      }}
    />
  )

  const sharedProps = {
    ref,
    onMouseMove: handleMove,
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
    whileHover: { y: -3 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
    className,
  }

  if (scrollTo) {
    return (
      <motion.button
        {...sharedProps}
        onClick={() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" })}
      >
        {glow}
        <span className="relative flex items-center gap-2">{children}</span>
      </motion.button>
    )
  }

  return (
    <Link to={to}>
      <motion.button {...sharedProps}>
        {glow}
        <span className="relative flex items-center gap-2">{children}</span>
      </motion.button>
    </Link>
  )
}

export default function HeroSection() {
  const containerRef = useRef(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,0.14), transparent 70%)`

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, 100])

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 overflow-hidden text-center"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />
      <motion.div style={{ y: blobY1 }} className="absolute rounded-full pointer-events-none top-40 left-1/4 w-96 h-96 bg-purple-600/8 blur-3xl" />
      <motion.div style={{ y: blobY2 }} className="absolute rounded-full pointer-events-none top-60 right-1/4 w-96 h-96 bg-pink-600/8 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-sm text-purple-300 border rounded-full bg-purple-500/10 border-purple-500/20"
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full bg-purple-400 rounded-full opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-purple-400" />
          </span>
          Placement analysis based on your academic profile
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          {headlineLines.map((line, i) => (
            <motion.span
              key={line.text}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.3 + i * 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={
                line.gradient
                  ? "block py-1 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text"
                  : "block"
              }
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-12 text-lg leading-relaxed text-gray-400 md:text-xl"
        >
          Your academic profile, evaluated against real placement outcomes — with a clear breakdown of your strengths and areas for improvement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row"
        >
          <GlowButton to="/predict" primary>
            Check My Placement Chances
            <FaArrowRight className="text-sm" />
          </GlowButton>
          <GlowButton scrollTo="how-it-works">How it works</GlowButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-stretch justify-center max-w-2xl mx-auto divide-x divide-gray-800"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 px-4">
              <div className="text-2xl font-bold text-white">
                {stat.value != null ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : stat.display}
              </div>
              <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </motion.div>

      <motion.button
        onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
        style={{ opacity: heroOpacity }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute z-10 flex flex-col items-center gap-2 text-gray-500 transition-colors -translate-x-1/2 bottom-8 left-1/2 hover:text-gray-300"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <FiChevronDown />
        </motion.span>
      </motion.button>
    </section>
  )
}