import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import logo from "../assets/HireSense.png"

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Predict", to: "/predict" },
  { label: "Analysis", to: "/analysis" },
  { label: "About", to: "/about" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5">
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex items-center gap-1 px-2 py-2 rounded-3xl"
        style={{
          background: scrolled
            ? "rgba(10, 6, 25, 0.82)"
            : "rgba(10, 6, 25, 0.60)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(139, 92, 246, 0.18)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.07) 0%, transparent 60%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          className="relative z-10 flex items-center pl-2 pr-4"
          style={{ borderRight: "1px solid rgba(139,92,246,0.18)" }}
        >
          <Link to="/">
            <img src={logo} alt="HireSense" className="w-auto h-7" />
          </Link>
        </motion.div>

        <div className="relative z-10 flex items-center">
          {navLinks.map(({ label, to }, i) => {
            const isActive = location.pathname === to
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
              >
                <Link
                  to={to}
                  className="relative px-4 py-1.5 rounded-3xl text-sm font-medium transition-colors duration-200 block"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.42)",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 rounded-3xl"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      style={{
                        background: "linear-gradient(135deg, rgba(139,92,246,0.30), rgba(236,72,153,0.18))",
                        border: "1px solid rgba(139,92,246,0.28)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 12px rgba(139,92,246,0.15)",
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )
}