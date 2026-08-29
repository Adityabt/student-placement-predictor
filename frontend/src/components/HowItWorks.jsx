import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion"
import { FiEdit3, FiZap, FiTrendingUp } from "react-icons/fi"
import GlowCard from "./GlowCard"
import { stagger, fadeUp } from "../lib/motionVariants"

const EASE = [0.16, 1, 0.3, 1]

const steps = [
  { icon: FiEdit3, title: "Fill Your Profile", description: "Enter your academic scores, skills, projects, and experience — takes under two minutes." },
  { icon: FiZap, title: "Get Your Prediction", description: "Your profile is instantly analyzed against real placement outcomes to generate a readiness score." },
  { icon: FiTrendingUp, title: "See What to Improve", description: "Get a precise breakdown of your strengths and the specific gaps holding you back." },
]

// Same 3D-tilt treatment used on the Analysis/Predict cards — kept local
// since there's no shared component file for it yet (mirrors the existing
// pattern of HoverCard being duplicated per-file rather than imported).
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 scroll-mt-28">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-widest text-purple-400 uppercase">How It Works</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Three steps to clarity</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.18)}
          className="relative grid gap-6 md:grid-cols-3"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{ transformOrigin: "left" }}
            className="absolute hidden h-px md:block top-10 left-[20%] right-[20%] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
          />

          {steps.map(({ icon: Icon, title, description }, i) => (
            <motion.div key={title} variants={fadeUp}>
              <TiltCard>
                <GlowCard className="h-full">
                  <div className="relative flex flex-col items-center h-full p-8 overflow-hidden text-center group">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                      className="absolute select-none pointer-events-none -top-3 -right-1 text-8xl font-bold text-white/[0.035] group-hover:text-white/[0.06] transition-colors duration-500"
                    >
                      {`0${i + 1}`}
                    </motion.span>
                    <div className="relative flex items-center justify-center mb-6 transition-all duration-300 border w-14 h-14 rounded-2xl bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/15 group-hover:border-purple-500/30 group-hover:rotate-6 group-hover:scale-105">
                      <Icon className="text-xl text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="relative mb-3 text-lg font-semibold text-white">{title}</h3>
                    <p className="relative text-sm leading-relaxed text-gray-500">{description}</p>
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