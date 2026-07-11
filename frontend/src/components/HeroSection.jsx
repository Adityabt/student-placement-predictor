import { motion } from "framer-motion"
import { FaBrain, FaChartLine, FaRocket, FaDatabase } from "react-icons/fa"

const stats = [
  { value: "10K+", label: "Students Analyzed" },
  { value: "79%", label: "Model Accuracy" },
  { value: "9", label: "Features Used" },
  { value: "50", label: "Optuna Trials" },
]

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 text-sm mb-8"
        >
          <FaBrain className="text-xs" />
          Powered by XGBoost + SHAP + Optuna
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Know Your
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Placement Odds
          </span>
          Before Interview Day
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Enter your academic profile and get an instant AI-powered prediction
          with explainable SHAP analysis showing exactly what's helping or hurting your chances.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: FaBrain, label: "XGBoost Model" },
            { icon: FaChartLine, label: "SHAP Explainability" },
            { icon: FaDatabase, label: "10K Real Records" },
            { icon: FaRocket, label: "Optuna Tuned" },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-sm text-gray-300"
            >
              <Icon className="text-purple-400 text-xs" />
              {label}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl py-4 px-3"
            >
              <div className="text-2xl font-bold text-purple-400">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="#predict"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-10 py-4 rounded-xl transition-all text-lg shadow-lg shadow-purple-900/30"
        >
          Check My Placement Chances
          <FaRocket className="text-sm" />
        </motion.a>
      </motion.div>
    </section>
  )
}