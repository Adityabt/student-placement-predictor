import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"

const stack = [
  { category: "ML & Backend", items: ["XGBoost", "SHAP", "Optuna", "FastAPI", "scikit-learn", "pandas", "joblib"] },
  { category: "Frontend", items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Recharts"] },
  { category: "Deployment", items: ["Render", "Vercel"] },
]

const contributors = [
  { name: "Aditya Thakur", role: "ML Model · SHAP · FastAPI Backend · Profile Analysis", github: "https://github.com/Adityabt" },
  { name: "Jiya", role: "Data Cleaning · Prediction UI · Frontend · Deployment", github: "https://github.com/jiyagithub" },
]

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl px-6 mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm text-purple-400 border rounded-full bg-purple-500/10 border-purple-500/20">
            About HireSense
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Built to Help Students
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Know Where They Stand
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-400">
            HireSense is an AI-powered placement prediction platform that uses
            machine learning to give students a clear, honest picture of their
            placement readiness — with explainable insights, not just a number.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="p-8 mb-8 bg-gray-900 border border-gray-800 rounded-2xl"
        >
          <h2 className="mb-6 text-lg font-semibold text-white">Tech Stack</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {stack.map(({ category, items }) => (
              <div key={category}>
                <p className="mb-3 text-xs font-semibold tracking-wider text-purple-400 uppercase">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span
                      key={item}
                      className="text-xs text-gray-300 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="p-8 mb-8 bg-gray-900 border border-gray-800 rounded-2xl"
        >
          <h2 className="mb-6 text-lg font-semibold text-white">Model Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs tracking-wider text-gray-500 uppercase border-b border-gray-800">
                  <th className="pb-3 text-left">Model</th>
                  <th className="pb-3 text-left">Accuracy</th>
                  <th className="pb-3 text-left">Precision</th>
                  <th className="pb-3 text-left">Recall</th>
                  <th className="pb-3 text-left">F1</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-800/50">
                  <td className="py-3">Logistic Regression</td>
                  <td className="py-3">78.5%</td>
                  <td className="py-3">73.3%</td>
                  <td className="py-3">75.6%</td>
                  <td className="py-3">74.4%</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3">Random Forest</td>
                  <td className="py-3">78.8%</td>
                  <td className="py-3">76.0%</td>
                  <td className="py-3">71.3%</td>
                  <td className="py-3">73.6%</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">XGBoost (Optuna Tuned)</td>
                  <td className="py-3 font-medium text-purple-400">79.3%</td>
                  <td className="py-3">—</td>
                  <td className="py-3">—</td>
                  <td className="py-3">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="p-8 bg-gray-900 border border-gray-800 rounded-2xl"
        >
          <h2 className="mb-6 text-lg font-semibold text-white">Contributors</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {contributors.map(({ name, role, github }) => (
              <div
                key={name}
                className="flex items-start gap-4 p-5 border bg-gray-800/50 border-gray-700/50 rounded-xl"
              >
                <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-purple-500/20 border-purple-500/30 shrink-0">
                  <span className="text-sm font-bold text-purple-400">{name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-white">{name}</p>
                    <a href={github} target="_blank" className="text-gray-500 transition-colors hover:text-purple-400">
                      <FaGithub className="text-base" />
                    </a>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}