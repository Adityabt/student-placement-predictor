import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Analysis from "./pages/Analysis"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-white bg-gray-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}