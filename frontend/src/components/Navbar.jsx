import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
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
  const [hovered, setHovered] = useState(null)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5">
      <motion.nav
        aria-label="Main navigation"
        initial={reduceMotion ? false : { y: -70, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex items-center gap-1 px-2 py-2 overflow-hidden rounded-3xl"
        style={{
          background: scrolled
            ? "rgba(10, 6, 25, 0.88)"
            : "rgba(10, 6, 25, 0.62)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(167, 139, 250, 0.20)",
          boxShadow: scrolled
            ? "0 12px 44px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 5px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(139,92,246,.18),transparent_28%),radial-gradient(circle_at_94%_100%,rgba(236,72,153,.10),transparent_30%)]" />

        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            animate={{ x: ["-130%", "260%"] }}
            transition={{
              duration: 5.5,
              delay: 1.1,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-y-0 w-20 -skew-x-12 bg-gradient-to-r from-transparent via-white/[.09] to-transparent blur-sm"
          />
        )}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          whileHover={reduceMotion ? undefined : { scale: 1.045, rotate: -1 }}
          className="relative z-10 flex items-center pl-2 pr-4 border-r border-purple-300/20"
        >
          <Link
            to="/"
            aria-label="HireSense home"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-pink-300/80"
          >
            <img
              src={logo}
              alt="HireSense"
              className="h-7 w-auto drop-shadow-[0_0_9px_rgba(196,181,253,.20)]"
            />
          </Link>
        </motion.div>

        <div
          className="relative z-10 flex items-center"
          onMouseLeave={() => setHovered(null)}
        >
          {navLinks.map(({ label, to }, i) => {
            const isActive = location.pathname === to
            const isHovered = hovered === label

            return (
              <motion.div
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + i * 0.07, duration: 0.35 }}
              >
                <Link
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setHovered(label)}
                  onFocus={() => setHovered(label)}
                  onBlur={() => setHovered(null)}
                  className="relative block rounded-3xl px-4 py-1.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-pink-300/80"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,1)"
                      : isHovered
                        ? "rgba(255,255,255,.82)"
                        : "rgba(255,255,255,.43)",
                  }}
                >
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="navbar-hover-halo"
                      className="absolute inset-0 rounded-3xl bg-white/[.055]"
                      transition={{
                        type: "spring",
                        stiffness: 480,
                        damping: 34,
                      }}
                    />
                  )}

                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 overflow-hidden rounded-3xl"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(139,92,246,.34), rgba(236,72,153,.20))",
                        border: "1px solid rgba(196,181,253,.28)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,.11), 0 0 16px rgba(139,92,246,.16)",
                      }}
                    >
                      {!reduceMotion && (
                        <motion.span
                          animate={{ x: ["-180%", "260%"] }}
                          transition={{
                            duration: 2.6,
                            delay: 0.7,
                            repeat: Infinity,
                            repeatDelay: 3.2,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-y-0 w-8 -skew-x-12 bg-white/20 blur-sm"
                        />
                      )}
                    </motion.span>
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