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
import SpyDashboard from "./components/SpyDashboard";
import StatsSection from "./components/StatsSection";
import FunFacts from "./components/FunFacts";
import CodeBreakerLab from "./components/CodeBreakerLab";
import MemoryMatch from "./components/MemoryMatch";
import CipherWheel from "./components/CipherWheel";
import DailySecretMessage from "./components/DailySecretMessage";
import RandomMessageGen from "./components/RandomMessageGen";
import PasswordTools from "./components/PasswordTools";
import Conclusion from "./components/Conclusion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import SettingsPanel from "./components/SettingsPanel";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { key: "Alt + H", desc: "Go to Home",          section: "top" },
  { key: "Alt + L", desc: "Open Cipher Lab",     section: "cipher-lab" },
  { key: "Alt + Q", desc: "Start Quiz",          section: "quiz" },
  { key: "Alt + D", desc: "Spy Dashboard",       section: "spy-dashboard" },
  { key: "Alt + B", desc: "Code Breaker Lab",    section: "codebreaker" },
  { key: "Alt + P", desc: "Password Tools",      section: "password-tools" },
  { key: "Alt + W", desc: "Cipher Wheel",        section: "cipher-wheel" },
  { key: "Alt + M", desc: "Daily Message",       section: "daily-message" },
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const key = e.key.toLowerCase();
      const map: Record<string, string> = { h: "top", l: "cipher-lab", q: "quiz", d: "spy-dashboard", b: "codebreaker", p: "password-tools", w: "cipher-wheel", m: "daily-message" };
      if (map[key]) {
        e.preventDefault();
        const el = document.getElementById(map[key]);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (key === "k") {
        e.preventDefault();
        setShowShortcuts((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
        <SpyDashboard />
        <StatsSection />
        <FunFacts />
        <CodeBreakerLab />

        <section id="memory-match" className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                🃏 Mini Game
              </span>
              <h2 className="text-4xl sm:text-5xl font-black mb-4">
                Memory <span className="gradient-text">Match</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Match each letter with its cipher equivalent. Learn Morse Code, Binary, and Number Cipher through play!
              </p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 shadow-sm">
              <MemoryMatch />
            </div>
          </div>
        </section>

        <CipherWheel />
        <DailySecretMessage />
        <RandomMessageGen />
        <PasswordTools />
        <Conclusion />
      </main>
      <Footer />
      <Toast />
      <SettingsPanel dark={dark} setDark={setDark} />

      <button
        onClick={() => setShowShortcuts((s) => !s)}
        className="fixed bottom-6 right-4 z-40 bg-card border border-border shadow-lg rounded-full p-3 hover:bg-muted transition-all hover:scale-110 active:scale-95"
        title="Keyboard Shortcuts (Alt+K)"
      >
        <Keyboard className="w-5 h-5 text-muted-foreground" />
      </button>

      {showShortcuts && (
        <div className="fixed bottom-16 right-4 z-50 bg-card border border-border rounded-2xl shadow-2xl p-4 w-72 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm">Keyboard Shortcuts</span>
            <button onClick={() => setShowShortcuts(false)} className="p-1 rounded hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{s.desc}</span>
                <kbd className="bg-muted border border-border rounded px-1.5 py-0.5 font-mono text-xs">{s.key}</kbd>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
              <span className="text-muted-foreground">Toggle this panel</span>
              <kbd className="bg-muted border border-border rounded px-1.5 py-0.5 font-mono text-xs">Alt + K</kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
