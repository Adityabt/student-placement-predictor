import { motion } from "framer-motion"

export default function SectionDivider({ label }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-20">
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-4 text-[11px] tracking-widest uppercase text-gray-600 whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
      <div className="flex items-center justify-center w-full max-w-xs">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "right" }}
          className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/40"
        />
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-2 h-2 mx-3 rounded-full shrink-0 bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
          className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/40"
        />
      </div>
    </div>
  )
}