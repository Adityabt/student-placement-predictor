import { FaGithub, FaLinkedin } from "react-icons/fa"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-t border-white/5 bg-gray-950 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

          <div className="flex flex-col gap-5 max-w-sm">
            <div>
              <img src="assets/" alt="" />
              <h2 className="text-white font-bold text-2xl tracking-tight mb-3">
                Hire<span className="text-purple-400">Sense</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                AI-powered placement prediction platform leveraging machine
                learning to help students assess their readiness with
                explainable insights.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Adityabt/student-placement-predictor"
                target="_blank"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-purple-400 transition-all duration-200"
              >
                <FaGithub className="text-base" />
              </a>
              <a
                href="https://linkedin.com/in/adityabt"
                target="_blank"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 flex items-center justify-center text-gray-400 hover:text-purple-400 transition-all duration-200"
              >
                <FaLinkedin className="text-base" />
              </a>
            </div>
          </div>

          <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col items-start md:items-end justify-center gap-3 self-center">
            <p className="text-gray-600 text-xs">
              © 2026 HireSense. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Developed by{" "}
              <a
                href="https://github.com/Adityabt"
                target="_blank"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Aditya Thakur
              </a>
              {" "}&{" "}
              <a
                href="https://github.com/jiyagithub"
                target="_blank"
                className="text-gray-400 hover:text-purple-400 transition-colors"
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