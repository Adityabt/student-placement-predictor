import { motion } from "framer-motion"
import { FiEdit3, FiZap, FiTrendingUp } from "react-icons/fi"

const steps = [
  {
    icon: FiEdit3,
    step: "01",
    title: "Fill Your Profile",
    description:
      "Enter your academic scores, skills, projects, and experience. Takes less than 2 minutes.",
  },
  {
    icon: FiZap,
    step: "02",
    title: "Get Your Prediction",
    description:
      "Our AI instantly analyzes your profile and gives you a placement probability with confidence score.",
  },
  {
    icon: FiTrendingUp,
    step: "03",
    title: "See What to Improve",
    description:
      "Get a detailed breakdown of your strengths and the exact areas that are holding you back.",
  },
]

export default function HowItWorks() {
  return (
    <section className="relative px-6 py-24">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium tracking-widest text-purple-400 uppercase">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Three steps to clarity
          </h2>
        </motion.div>

        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {steps.map(({ icon: Icon, step, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center p-8 text-center border rounded-2xl bg-gray-900/40 border-gray-800/60 backdrop-blur-sm"
            >
              <div className="relative mb-6">
                <div className="flex items-center justify-center border w-14 h-14 rounded-2xl bg-purple-500/10 border-purple-500/20">
                  <Icon className="text-xl text-purple-400" />
                </div>
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold border border-gray-800 rounded-full -top-2 -right-2 text-purple-400/60 bg-gray-950">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}