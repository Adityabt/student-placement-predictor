import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion"
import { FiTarget, FiEye, FiShield, FiClock } from "react-icons/fi"
import GlowCard from "./GlowCard"
import SectionDivider from "./SectionDivider"
import { stagger, fadeUp } from "../lib/motionVariants"

// Kept in sync with /analysis's total_students (placement_clean.csv,
// 15,200 rows) — matches the "15K+" figure on the hero stats.
const features = [
  {
    icon: FiTarget,
    title: "Accurate Predictions",
    description: "Built on real outcomes data from thousands of student placements — not assumptions.",
    span: 2,
    badge: "15,000+ profiles analyzed",
  },
  {
    icon: FiEye,
    title: "Transparent Results",
    description: "Every result comes with the reasoning behind it — never just a number.",
    span: 1,
  },
  {
    icon: FiShield,
    title: "Honest Feedback",
    description: "Direct, unfiltered feedback on your weak spots — so you can fix them while there's still time.",
    span: 1,
  },
  {
    icon: FiClock,
    title: "Instant Analysis",
    description: "Your full breakdown in seconds. No waiting, no account required.",
    span: 2,
  },
]

// Same 3D-tilt treatment used on the Analysis/Predict cards — kept local
// since there's no shared component file for it yet.
function TiltCard({ children, intensity = 6, className = "" }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * intensity)
    rotateX.set(-py * intensity)
  }
  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

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
  )
}

export default function WhyHireSense() {
  return (
    <section className="relative px-6 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto">

        <SectionDivider label="Why It Works" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-widest text-purple-400 uppercase">Why HireSense</p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Built for students who want
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">real answers</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            Most students walk into placements blind. HireSense gives you the clarity to walk in confident.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.12)}
          className="grid gap-5 md:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, description, span, badge }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={span === 2 ? "md:col-span-2" : "md:col-span-1"}
            >
              <TiltCard>
                <GlowCard className="h-full">
                  {/* `group` was missing here before — the icon's
                      group-hover classes below had nothing to key off of
                      and never fired. */}
                  <div className="flex flex-col h-full gap-4 p-6 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center justify-center transition-all duration-300 border w-11 h-11 rounded-xl bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/15 group-hover:border-purple-500/30 group-hover:rotate-6 group-hover:scale-105">
                        <Icon className="text-lg text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      {badge && (
                        <span className="px-2.5 py-1 text-[11px] font-medium text-purple-300 border rounded-full bg-purple-500/10 border-purple-500/20 transition-colors duration-300 group-hover:bg-purple-500/15 group-hover:border-purple-500/30">
                          {badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">{title}</h3>
                      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
                    </div>
                  </div>
                </GlowCard>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}