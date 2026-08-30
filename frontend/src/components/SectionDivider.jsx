import { motion, useReducedMotion } from "framer-motion"

const EASE = [0.16, 1, 0.3, 1]

function ShimmerLine({ side, reduceMotion }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ transformOrigin: side === "left" ? "right" : "left" }}
      className={`relative flex-1 h-px overflow-hidden bg-gradient-to-${
        side === "left" ? "r" : "l"
      } from-transparent via-purple-500/30 to-pink-500/50`}
    >
      {!reduceMotion && (
        <motion.div
          className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          initial={{ left: "-20%" }}
          animate={{ left: "120%" }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatDelay: 2.5,
            delay: side === "right" ? 0.3 : 0,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  )
}

export default function SectionDivider({ label }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative flex flex-col items-center justify-center h-24">
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          className="relative mb-5"
        >
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text whitespace-nowrap">
            {label}
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
            style={{ transformOrigin: "center" }}
            className="absolute left-0 right-0 h-px -bottom-2 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
          />
        </motion.div>
      )}

      <div className="flex items-center justify-center w-full max-w-xs">
        <ShimmerLine side="left" reduceMotion={reduceMotion} />

        {/* Centerpiece — rotating gem with a soft pulsing halo behind it */}
        <div className="relative flex items-center justify-center mx-4 shrink-0">
          {!reduceMotion && (
            <motion.span
              className="absolute rounded-full"
              style={{
                width: 22,
                height: 22,
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
          >
            <motion.span
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="block w-2.5 h-2.5 rotate-45 shadow-[0_0_14px_rgba(168,85,247,0.85)]"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}
            />
          </motion.div>
        </div>

        <ShimmerLine side="right" reduceMotion={reduceMotion} />
      </div>
    </div>
  )
}