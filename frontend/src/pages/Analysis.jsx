import { useState } from "react"
import { Link } from "react-router-dom"
import AnalysisSection from "../components/AnalysisSection"
import { FaArrowLeft } from "react-icons/fa"

export default function Analysis() {
  const storedResult = JSON.parse(sessionStorage.getItem("predictionResult") || "null")

  if (!storedResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 pt-24 text-center">
        <p className="text-lg text-gray-400">No prediction found. Run a prediction first.</p>
        <Link
          to="/predict"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-colors bg-purple-600 hover:bg-purple-500 rounded-xl"
        >
          <FaArrowLeft className="text-xs" />
          Go to Predict
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      <AnalysisSection result={storedResult} />
    </div>
  )
}