import { FaGraduationCap } from "react-icons/fa"
import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="text-purple-400 text-2xl" />
          <span className="text-white font-bold text-lg tracking-tight">
            HireSense
          </span>
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-400">
          <a href="#predict" className="hover:text-purple-400 transition-colors">Predict</a>
          <a href="#analysis" className="hover:text-purple-400 transition-colors">Analysis</a>
          <a
            href="https://github.com/Adityabt/student-placement-predictor"
            target="_blank"
            className="hover:text-purple-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.nav>
  )
}