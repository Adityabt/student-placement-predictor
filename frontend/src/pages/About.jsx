import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"
import { FiCpu, FiLayout, FiCloud } from "react-icons/fi"
import GlowCard from "../components/GlowCard"
import SectionDivider from "../components/SectionDivider"
import { stagger, fadeUp } from "../lib/motionVariants"

const EASE = [0.16, 1, 0.3, 1]

const headlineLines = [
  { text: "Built by students,", gradient: false },
  { text: "for students.", gradient: true },
]

const stack = [
  {
    category: "ML & Backend",
    icon: FiCpu,
    items: ["CatBoost", "SHAP", "Optuna", "FastAPI", "scikit-learn", "pandas", "joblib"],
  },
  {
    category: "Frontend",
    icon: FiLayout,
    items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Recharts"],
  },
  {
    category: "Deployment",
    icon: FiCloud,
    items: ["Render", "Vercel"],
  },
]

const modelComparison = [
  { name: "Logistic Regression", accuracy: "83.2%", precision: "79.8%", recall: "80.0%", f1: "79.9%" },
  { name: "Random Forest", accuracy: "84.4%", precision: "83.3%", recall: "78.6%", f1: "80.8%" },
  { name: "LightGBM", accuracy: "84.2%", precision: "82.3%", recall: "79.5%", f1: "80.9%" },
]

const contributors = [
  {
    name: "Aditya Thakur",
    roles: ["ML Pipeline", "FastAPI Backend", "Insights & Analysis"],
    github: "https://github.com/Adityabt",
  },
  {
    name: "Jiya",
    roles: ["Data Cleaning", "Prediction Flow", "Deployment"],
    github: "https://github.com/jiyagithub",
  },
]

function HoverCard({ children }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="h-full transition-shadow duration-300 rounded-2xl hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <div className="relative min-h-screen pt-24 pb-24 overflow-hidden">
      {/* Ambient glow blobs — matches the home page's premium aesthetic */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl px-6 mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm text-purple-400 border rounded-full bg-purple-500/10 border-purple-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            About HireSense
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl leading-[1.15]">
            {headlineLines.map((line, i) => (
              <motion.span
                key={line.text}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.6, ease: EASE }}
                className={
                  line.gradient
                    ? "block py-1 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
                    : "block text-white"
                }
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-xl mx-auto text-lg leading-relaxed text-gray-400"
          >
            We built HireSense because we were tired of guessing. It's a model
            trained on real placement outcomes, built to give you an honest
            read on where you stand — and a clear, specific breakdown of
            what to work on next.
          </motion.p>
        </motion.div>

        {/* Tech Stack */}
        <SectionDivider label="The Stack" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">What's under the hood</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            The tools and frameworks that power HireSense end-to-end.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.12)}
          className="grid gap-5 mb-20 md:grid-cols-3"
        >
          {stack.map(({ category, icon: Icon, items }) => (
            <motion.div key={category} variants={fadeUp}>
              <HoverCard>
                <GlowCard>
                  <div className="h-full p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center border w-9 h-9 rounded-xl bg-purple-500/10 border-purple-500/20">
                        <Icon className="text-purple-400" size={15} />
                      </div>
                      <p className="text-xs font-semibold tracking-wider text-purple-300 uppercase">
                        {category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="text-xs text-gray-300 bg-gray-950/80 border border-white/10 px-3 py-1.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              </HoverCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Model Performance */}
        <SectionDivider label="The Numbers" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Tested against real outcomes</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            We cross-tested five different modeling approaches before
            picking the one that actually generalized best on unseen data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <GlowCard>
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 pb-8 mb-8 text-center border-b border-white/5 md:flex-row md:items-end md:justify-between md:text-left">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wider text-purple-400 uppercase">
                    Production model
                  </p>
                  <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    84.7%
                  </p>
                  <p className="max-w-xs mt-2 text-sm text-gray-500">
                    Held-out test accuracy — measured on profiles the model
                    never saw during training.
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Trained on
                  </p>
                  <p className="text-3xl font-bold text-white">15,200+</p>
                  <p className="mt-1 text-sm text-gray-500">student profiles</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs tracking-wider text-gray-500 uppercase border-b border-white/5">
                      <th className="pb-3 text-left">Model</th>
                      <th className="pb-3 text-left">Accuracy</th>
                      <th className="pb-3 text-left">Precision</th>
                      <th className="pb-3 text-left">Recall</th>
                      <th className="pb-3 text-left">F1</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    {modelComparison.map((m) => (
                      <tr key={m.name} className="border-b border-white/5">
                        <td className="py-3">{m.name}</td>
                        <td className="py-3">{m.accuracy}</td>
                        <td className="py-3">{m.precision}</td>
                        <td className="py-3">{m.recall}</td>
                        <td className="py-3">{m.f1}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3 font-medium text-white">
                        CatBoost <span className="ml-1.5 text-[10px] font-semibold tracking-wider text-purple-400 uppercase">Production</span>
                      </td>
                      <td className="py-3 font-medium text-purple-400">84.7%</td>
                      <td className="py-3 text-gray-600">—</td>
                      <td className="py-3 text-gray-600">—</td>
                      <td className="py-3 text-gray-600">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-gray-600">
                CatBoost was selected as the production model for its native
                handling of categorical features and the best balance of
                accuracy and honest generalization — tuned with Optuna
                rather than hand-picked defaults.
              </p>
            </div>
          </GlowCard>
        </motion.div>

        {/* Contributors */}
        <SectionDivider label="The Team" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Meet the builders</h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed text-gray-500">
            Two engineering students, split down the middle — model and
            backend on one side, data and interface on the other.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.15)}
          className="grid gap-5 md:grid-cols-2"
        >
          {contributors.map(({ name, roles, github }) => (
            <motion.div key={name} variants={fadeUp}>
              <HoverCard>
                <GlowCard>
                  <div className="flex items-start h-full gap-4 p-6">
                    <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 shrink-0">
                      <span className="text-base font-bold text-purple-300">{name[0]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <p className="text-base font-semibold text-white">{name}</p>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 transition-colors hover:text-purple-400"
                        >
                          <FaGithub className="text-lg" />
                        </motion.a>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {roles.map((r) => (
                          <span
                            key={r}
                            className="text-[11px] text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </HoverCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 text-xs text-center text-gray-600"
        >
          Actively built and iterated on as a two-person engineering project.
        </motion.p>

      </div>
    </div>
  )
}