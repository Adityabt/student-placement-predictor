import { motion } from "framer-motion"
import { FiTarget, FiEye, FiShield, FiClock } from "react-icons/fi"

const features = [
  {
    icon: FiTarget,
    title: "Accurate Predictions",
    description:
      "Trained on real placement data from thousands of students — not guesswork.",
  },
  {
    icon: FiEye,
    title: "Transparent Results",
    description:
      "We don't just give you a number. We show you exactly why you got that result.",
  },
  {
    icon: FiShield,
    title: "Honest Feedback",
    description:
      "No sugarcoating. Know your real weak spots so you can actually fix them before placements.",
  },
  {
    icon: FiClock,
    title: "Instant Analysis",
    description:
      "Get your full profile breakdown in seconds — no waiting, no sign up required.",
  },
]

export default function WhyHireSense() {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-widest text-purple-400 uppercase">
            Why HireSense
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Built for students who want
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              real answers
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            Most students walk into placements blind. HireSense gives you the
            clarity to walk in confident.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex gap-5 p-6 border rounded-2xl bg-gray-900/40 border-gray-800/60 backdrop-blur-sm group"
            >
              <div className="flex items-center justify-center transition-all duration-200 border w-11 h-11 rounded-xl bg-purple-500/10 border-purple-500/20 shrink-0 group-hover:bg-purple-500/15 group-hover:border-purple-500/30">
                <Icon className="text-lg text-purple-400" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}