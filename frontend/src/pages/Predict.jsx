import { useState } from "react"
import PredictForm from "../components/PredictForm"
import ResultCard from "../components/ResultCard"

export default function Predict() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen pt-24">
      <PredictForm setResult={setResult} setLoading={setLoading} loading={loading} />
      {result && <ResultCard result={result} />}
    </div>
  )
}