import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
// import PredictForm from "./components/PredictForm";
// import ResultCard from "./components/ResultCard";
// import AnalysisSection from "./components/AnalysisSection";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLaoding] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <HeroSection />
      {/* <PredictForm setResult={setResult} setLoading={setLaoding} loading={loading} />
      {result && <ResultCard result={result} />}
      {result && <AnalysisSection result={result} />} */}
    </div>
  )
}