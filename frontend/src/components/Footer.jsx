import { FaGithub, FaLinkedin } from "react-icons/fa"
import { motion } from "framer-motion"
import logo from "../assets/HireSense.png"

export default function Footer() {
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
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Adityabt/student-placement-predictor"
                target="_blank"
                className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-gray-900 border border-gray-800 rounded-lg w-9 h-9 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-400"
              >
                <FaGithub className="text-base" />
              </a>
              <a
                href="https://linkedin.com/in/adityabt"
                target="_blank"
                className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-gray-900 border border-gray-800 rounded-lg w-9 h-9 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-400"
              >
                <FaLinkedin className="text-base" />
              </a>
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
                className="text-gray-300 transition-colors hover:text-purple-400"
              >
                Aditya Thakur
              </a>
              {" "}&{" "}
              <a
                href="https://github.com/jiyagithub"
                target="_blank"
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