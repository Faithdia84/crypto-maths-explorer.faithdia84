import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import WhatIsCrypto from "./components/WhatIsCrypto";
import CaesarCipher from "./components/CaesarCipher";
import MathSection from "./components/MathSection";
import Quiz from "./components/Quiz";
import FunFacts from "./components/FunFacts";
import Conclusion from "./components/Conclusion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar dark={dark} setDark={setDark} />
      <main>
        <Hero />
        <WhatIsCrypto />
        <CaesarCipher />
        <MathSection />
        <Quiz />
        <FunFacts />
        <Conclusion />
      </main>
      <Footer />
    </div>
  );
}
