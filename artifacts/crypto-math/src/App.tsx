import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import WhatIsCrypto from "./components/WhatIsCrypto";
import HistorySection from "./components/HistorySection";
import CipherComparison from "./components/CipherComparison";
import CipherLab from "./components/CipherLab";
import MathSection from "./components/MathSection";
import Quiz from "./components/Quiz";
import CipherChallenge from "./components/CipherChallenge";
import SecretAgentMode from "./components/SecretAgentMode";
import StatsSection from "./components/StatsSection";
import FunFacts from "./components/FunFacts";
import CodeBreakerLab from "./components/CodeBreakerLab";
import Conclusion from "./components/Conclusion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";

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
        <HistorySection />
        <CipherComparison />
        <CipherLab />
        <MathSection />
        <Quiz />
        <CipherChallenge />
        <SecretAgentMode />
        <StatsSection />
        <FunFacts />
        <CodeBreakerLab />
        <Conclusion />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
