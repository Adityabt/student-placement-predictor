import { motion } from "framer-motion"
import { FiEdit3, FiZap, FiTrendingUp } from "react-icons/fi"
import GlowCard from "./GlowCard"
import { stagger, fadeUp } from "../lib/motionVariants"

const steps = [
  { icon: FiEdit3, title: "Fill Your Profile", description: "Enter your academic scores, skills, projects, and experience — takes under two minutes." },
  { icon: FiZap, title: "Get Your Prediction", description: "Your profile is instantly analyzed against real placement outcomes to generate a readiness score." },
  { icon: FiTrendingUp, title: "See What to Improve", description: "Get a precise breakdown of your strengths and the specific gaps holding you back." },
]

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
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute hidden h-px md:block top-10 left-[20%] right-[20%] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
          />

          {steps.map(({ icon: Icon, title, description }, i) => (
            <GlowCard key={title} variants={fadeUp}>
              <div className="relative flex flex-col items-center p-8 overflow-hidden text-center">
                <span className="absolute select-none pointer-events-none -top-3 -right-1 text-8xl font-bold text-white/[0.035]">
                  {`0${i + 1}`}
                </span>
                <div className="relative flex items-center justify-center mb-6 border w-14 h-14 rounded-2xl bg-purple-500/10 border-purple-500/20">
                  <Icon className="text-xl text-purple-400" />
                </div>
                <h3 className="relative mb-3 text-lg font-semibold text-white">{title}</h3>
                <p className="relative text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            </GlowCard>
          ))}
        </motion.div>

      </div>
    </section>
  )
}