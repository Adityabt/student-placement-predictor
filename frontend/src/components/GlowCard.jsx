import { motion } from "framer-motion"

export default function GlowCard({ children, className = "", contentClassName = "", ...motionProps }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-2xl p-px group ${className}`}
      {...motionProps}
    >
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none rounded-2xl bg-gradient-to-br from-purple-500/60 via-pink-500/30 to-purple-500/60 group-hover:opacity-100" />
      <div className={`relative h-full bg-[#0d0b16] border border-gray-800/60 rounded-2xl transition-colors ${contentClassName}`}>
        {children}
      </div>
    </motion.div>
  )
}