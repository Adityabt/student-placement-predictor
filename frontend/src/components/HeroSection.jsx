import { motion } from "framer-motion"
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"

const stats = [
  { value: "10K+", label: "Students Analyzed" },
  { value: "79%", label: "Prediction Accuracy" },
  { value: "instant", label: "Results" },
  { value: "free", label: "No Sign Up" },
]

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 overflow-hidden text-center">

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
      <div className="absolute rounded-full pointer-events-none top-40 left-1/4 w-96 h-96 bg-purple-600/8 blur-3xl" />
      <div className="absolute rounded-full pointer-events-none top-60 right-1/4 w-96 h-96 bg-pink-600/8 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-sm text-purple-300 border rounded-full bg-purple-500/10 border-purple-500/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Know your placement readiness in minutes
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
        >
          Know Your
          <span className="block py-1 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text">
            Placement Odds
          </span>
          Before Interview Day
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-12 text-lg leading-relaxed text-gray-400 md:text-xl"
        >
          Enter your academic profile and instantly find out your placement
          chances — with a clear breakdown of exactly what's working in your
          favour and what needs improvement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row"
        >
          <Link to="/predict">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-base shadow-lg shadow-purple-900/30"
            >
              Check My Placement Chances
              <FaArrowRight className="text-sm" />
            </motion.button>
          </Link>

          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-xl transition-all text-base"
            >
              How it works
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid max-w-2xl grid-cols-2 gap-3 mx-auto md:grid-cols-4">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="px-3 py-4 border bg-gray-900/40 border-gray-800/80 rounded-xl backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-white capitalize">{value}</div>
              <div className="mt-1 text-xs text-gray-500">{label}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}