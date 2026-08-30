import { useState, useRef, useEffect } from "react"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../assets/HireSense.png"

const socials = [
  {
    id: "github",
    icon: FaGithub,
    label: "GitHub",
    accent: "from-gray-400/25 to-gray-600/25",
    ring: "ring-gray-400/30",
    links: [
      { name: "Aditya Thakur", url: "https://github.com/Adityabt" },
      { name: "Jiya", url: "https://github.com/jiyagithub" },
    ],
  },
  {
    id: "linkedin",
    icon: FaLinkedin,
    label: "LinkedIn",
    accent: "from-blue-400/25 to-purple-500/25",
    ring: "ring-blue-400/30",
    links: [
      { name: "Aditya Thakur", url: "https://linkedin.com/in/adityabt" },
      { name: "Jiya", url: "https://www.linkedin.com/in/jiya0106/" },
    ],
  },
]

function Avatar({ link, accent, delay }) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, x: -6 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.5, x: -6 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, delay }}
      className="relative flex-shrink-0 group/avatar"
    >
      {/* tooltip */}
      <div className="absolute px-2 py-1 text-[10px] font-medium text-gray-200 whitespace-nowrap -translate-x-1/2 bg-gray-800 border border-white/10 rounded-md opacity-0 pointer-events-none -top-8 left-1/2 group-hover/avatar:opacity-100 transition-opacity duration-150 shadow-lg">
        {link.name}
        <div className="absolute w-1.5 h-1.5 -translate-x-1/2 rotate-45 bg-gray-800 border-b border-r border-white/10 -bottom-[3px] left-1/2" />
      </div>

      <span
        className={`flex items-center justify-center w-8 h-8 text-[11px] font-semibold text-white rounded-full bg-gradient-to-br ${accent} border border-white/15 shadow-md transition-transform duration-150 group-hover/avatar:scale-110 group-hover/avatar:border-white/30`}
      >
        {link.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
      </span>
    </motion.a>
  )
}

function SocialGroup({ social, isActive, onToggle }) {
  const Icon = social.icon

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className={`flex items-center h-10 gap-2 px-1 border rounded-full transition-colors duration-200 ${
        isActive
          ? "bg-gray-900 border-gray-700/80"
          : "bg-transparent border-transparent"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(social.id)}
        aria-label={social.label}
        aria-expanded={isActive}
        className={`relative flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full transition-all duration-200 ${
          isActive
            ? `bg-gradient-to-br ${social.accent} text-white ring-1 ${social.ring}`
            : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-400"
        }`}
      >
        <Icon className="text-sm" />
      </button>

      <AnimatePresence mode="popLayout">
        {isActive && (
          <motion.div
            key="avatars"
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="flex items-center gap-1.5 overflow-visible pr-1.5"
          >
            <div className="w-px h-4 mr-0.5 bg-gray-700/80 flex-shrink-0" />
            {social.links.map((link, i) => (
              <Avatar key={link.url} link={link} accent={social.accent} delay={0.05 + i * 0.04} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Footer() {
  const [active, setActive] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActive(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden border-t border-gray-800 bg-gray-950"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 rounded-full pointer-events-none left-1/4 w-72 h-72 bg-purple-600/10 blur-3xl" />
      <div className="absolute bottom-0 rounded-full pointer-events-none right-1/4 w-72 h-72 bg-pink-600/10 blur-3xl" />

      <div className="relative max-w-5xl px-6 py-10 mx-auto">
        <div className="flex flex-col items-center gap-0 md:flex-row">
          <div className="flex flex-col items-start flex-1 gap-5 pr-12">
            <div className="flex items-center gap-2">
              <img src={logo} alt="HireSense" className="w-auto h-12" />
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              AI-powered placement prediction platform leveraging machine
              learning to help students assess their readiness with
              explainable insights.
            </p>

            <div ref={containerRef} className="flex items-center gap-2">
              {socials.map((s) => (
                <SocialGroup
                  key={s.id}
                  social={s}
                  isActive={active === s.id}
                  onToggle={(id) => setActive((prev) => (prev === id ? null : id))}
                />
              ))}
            </div>
          </div>

          <div className="self-stretch hidden w-px mx-4 md:block bg-gradient-to-b from-transparent via-gray-800 to-transparent" />

          <div className="flex flex-col items-end justify-center flex-1 gap-3 pl-12">
            <p className="text-xs text-right text-gray-600">
              © 2026 HireSense. All rights reserved.
            </p>
            <p className="text-sm text-right text-gray-500">
              Developed by{" "}
              <a
                href="https://github.com/Adityabt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition-colors hover:text-purple-400"
              >
                Aditya Thakur
              </a>{" "}
              &{" "}
              <a
                href="https://github.com/jiyagithub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition-colors hover:text-purple-400"
              >
                Jiya
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}