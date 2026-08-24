import { motion } from "framer-motion"
import { FiTarget, FiEye, FiShield, FiClock } from "react-icons/fi"
import GlowCard from "./GlowCard"
import SectionDivider from "./SectionDivider"
import { stagger, fadeUp } from "../lib/motionVariants"

const features = [
  {
    icon: FiTarget,
    title: "Accurate Predictions",
    description: "Built on real outcomes data from thousands of student placements — not assumptions.",
    span: 2,
    badge: "10,000+ profiles analyzed",
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
            <GlowCard key={title} variants={fadeUp} className={span === 2 ? "md:col-span-2" : "md:col-span-1"}>
              <div className="flex flex-col h-full gap-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center transition-all duration-300 border w-11 h-11 rounded-xl bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/15 group-hover:border-purple-500/30 group-hover:rotate-6">
                    <Icon className="text-lg text-purple-400" />
                  </div>
                  {badge && (
                    <span className="px-2.5 py-1 text-[11px] font-medium text-purple-300 border rounded-full bg-purple-500/10 border-purple-500/20">
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
          ))}
        </motion.div>

      </div>
    </section>
  )
}