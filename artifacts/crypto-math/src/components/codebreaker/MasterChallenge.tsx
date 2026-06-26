import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Timer, Trophy } from "lucide-react";
import { getCBStats, saveCBStats, checkAchievements } from "../../utils/cbData";
import { showToast } from "../../utils/toast";

interface MasterStep {
  title: string;
  cipher: string;
  encrypted: string;
  answer: string;
  hint: string;
  explanation: string;
}

const MASTER_STEPS: MasterStep[] = [
  {
    title: "Stage 1 — Caesar Cipher",
    cipher: "Caesar Cipher (Shift 5)",
    encrypted: "MJQQT",
    answer: "HELLO",
    hint: "Shift each letter backward by 5. M→H, J→E, Q→L, Q→L, T→O",
    explanation: "MJQQT is HELLO encrypted with Caesar shift 5. Decrypt by going back 5: M(13)−5=H(8), J(10)−5=E(5), Q(17)−5=L(12), T(20)−5=O(15).",
  },
  {
    title: "Stage 2 — Reverse Cipher",
    cipher: "Reverse Cipher",
    encrypted: "DLROW",
    answer: "WORLD",
    hint: "Read the message backwards! Reverse the entire string.",
    explanation: "DLROW is WORLD reversed. Simply reverse the letters: D-L-R-O-W backwards = W-O-R-L-D.",
  },
  {
    title: "Stage 3 — Number Cipher",
    cipher: "Number Cipher",
    encrypted: "13 1 19 20 5 18",
    answer: "MASTER",
    hint: "A=1, B=2 … Z=26. Convert each number to its letter. 13=M, 1=A, 19=S, 20=T, 5=E, 18=R.",
    explanation: "13=M, 1=A, 19=S, 20=T, 5=E, 18=R → MASTER. You are now the MASTER CODE BREAKER!",
  },
];

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#f59e0b","#10b981","#6366f1","#ec4899","#f43f5e","#3b82f6","#a855f7","#fbbf24"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: "-16px",
          width: `${6 + Math.random() * 10}px`,
          height: `${6 + Math.random() * 10}px`,
          background: colors[i % colors.length],
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `cb-fall ${2.5 + Math.random() * 2}s ${Math.random() * 2}s linear forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}
    </div>
  );
}

function useTypewriter(text: string, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return displayed;
}

export default function MasterChallenge() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [finished, setFinished] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = MASTER_STEPS[step];
  const storyText = "CLASSIFIED: The enemy has hidden a 3-layer encrypted message. You must decode each layer to reveal the final secret. Only a true Master Code Breaker can complete all three stages. Your mission starts NOW.";
  const typewriterText = useTypewriter(started ? storyText : "", 30);

  useEffect(() => {
    const s = getCBStats();
    setAlreadyDone(s.masterCompleted);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          showToast("⏰ Time's up! Try again!", "error");
          setStarted(false);
          setStep(0);
          setAnswer("");
          setResult(null);
          setShowHint(false);
          setTimeLeft(90);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished, step]);

  const submit = () => {
    if (!answer.trim() || result !== null) return;
    const correct = answer.trim().toUpperCase() === current.answer.toUpperCase();
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      showToast(`✅ Stage ${step + 1} decoded!`, "success");
    } else {
      showToast("❌ Not quite — try the hint!", "error");
    }
  };

  const nextStep = () => {
    if (step < MASTER_STEPS.length - 1) {
      setStep((s) => s + 1);
      setAnswer("");
      setResult(null);
      setShowHint(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setFinished(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
      const s = getCBStats();
      s.masterCompleted = true;
      s.totalScore += 1000;
      s.correctAnswers += MASTER_STEPS.length;
      const newAch = checkAchievements(s);
      for (const id of newAch) { s.unlockedAchievements.push(id); }
      saveCBStats(s);
      showToast("🏆 Master Code Breaker title earned!", "success");
    }
  };

  const restart = () => {
    setStarted(false);
    setStep(0);
    setAnswer("");
    setResult(null);
    setShowHint(false);
    setTimeLeft(90);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <Confetti active={confetti} />
        <div className="text-8xl mb-4">🏆</div>
        <h2 className="text-3xl sm:text-4xl font-black mb-3 gradient-text">
          MASTER CODE BREAKER
        </h2>
        <p className="text-muted-foreground mb-2 text-lg">Congratulations, Agent!</p>
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl p-6 max-w-md mx-auto mb-6 text-white shadow-2xl">
          <div className="font-black text-2xl mb-2">🎖️ Title Awarded</div>
          <div className="text-lg font-bold">"Master Code Breaker"</div>
          <div className="text-sm text-white/80 mt-2">
            You decoded 3 chained ciphers — Caesar, Reverse, and Number — to reveal the hidden message.
            You are now a Cryptography Champion!
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
          <div className="bg-card border border-border rounded-2xl p-3 text-center">
            <div className="text-xl font-black text-primary">3/3</div>
            <div className="text-xs text-muted-foreground">Stages</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 text-center">
            <div className="text-xl font-black text-yellow-500">+1000</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 text-center">
            <div className="text-xl font-black text-green-500">{timeLeft}s</div>
            <div className="text-xs text-muted-foreground">Left</div>
          </div>
        </div>
        <button onClick={restart}
          className="gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
          Play Again
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl p-8 mb-6 text-white shadow-2xl">
          <div className="text-7xl mb-4">👑</div>
          <h3 className="text-3xl font-black mb-3">Master Code Breaker Challenge</h3>
          <p className="text-white/80 text-base mb-2">The ultimate test. Three ciphers, one mission.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm mt-4">
            <div className="bg-white/20 rounded-xl px-4 py-2">Stage 1: Caesar Cipher</div>
            <div className="bg-white/20 rounded-xl px-4 py-2">Stage 2: Reverse Cipher</div>
            <div className="bg-white/20 rounded-xl px-4 py-2">Stage 3: Number Cipher</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 text-left shadow-sm max-w-lg mx-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">⏱ Rules</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 90 seconds total for all 3 stages</li>
            <li>• Decode all 3 encrypted messages in order</li>
            <li>• Each correct answer unlocks the next stage</li>
            <li>• Earn the "Master Code Breaker" title and 1000 bonus points!</li>
          </ul>
        </div>
        {alreadyDone && (
          <div className="mb-4 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-xl px-4 py-2 text-sm font-semibold inline-block">
            🏆 You've already completed this! Play again for fun.
          </div>
        )}
        <button onClick={() => setStarted(true)}
          className="gradient-bg text-white font-black text-xl px-10 py-4 rounded-2xl hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg">
          🚀 Begin Mission
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {step === 0 && typewriterText && (
        <div className="bg-slate-900 text-green-400 font-mono text-sm rounded-2xl p-4 mb-5 border border-green-700">
          <span className="text-green-600 mr-2">&gt;</span>{typewriterText}
          <span className="animate-pulse">|</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {MASTER_STEPS.map((_, i) => (
            <div key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i < step ? "bg-green-500 text-white" : i === step ? "gradient-bg text-white ring-2 ring-primary/50" : "bg-muted text-muted-foreground"
              }`}>
              {i < step ? "✓" : i + 1}
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-1.5 font-black text-sm ${timeLeft <= 20 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
          <Timer className="w-4 h-4" /> {timeLeft}s
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-5">
        <div className={`h-2 rounded-full transition-all duration-1000 ${timeLeft > 60 ? "bg-green-500" : timeLeft > 30 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${(timeLeft / 90) * 100}%` }} />
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-5 mb-5 text-white">
        <div className="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">{current.title}</div>
        <div className="text-sm opacity-80 mb-2">Cipher: {current.cipher}</div>
        <div className="text-2xl font-black font-mono text-center bg-white/10 rounded-xl px-4 py-3 break-all">
          {current.encrypted}
        </div>
      </div>

      {result === "correct" ? (
        <div className="bg-green-100 dark:bg-green-950/40 border border-green-300 dark:border-green-700 rounded-2xl p-4 mb-4 text-center animate-fade-in">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1" />
          <div className="font-black text-green-600 dark:text-green-400 text-lg">Stage {step + 1} Complete! ✅</div>
          <p className="text-sm text-muted-foreground mt-1">{current.explanation}</p>
          <button onClick={nextStep}
            className="mt-3 gradient-bg text-white font-bold px-6 py-2 rounded-xl hover:opacity-90 transition-all text-sm">
            {step < MASTER_STEPS.length - 1 ? `Proceed to Stage ${step + 2} →` : "🏆 Claim Title!"}
          </button>
        </div>
      ) : result === "wrong" ? (
        <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-700 rounded-2xl p-3 mb-4 text-center animate-fade-in">
          <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
          <div className="font-black text-red-500">Wrong — try again or use the hint!</div>
        </div>
      ) : null}

      {result !== "correct" && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Decode and type your answer..."
            className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
          />
          <button onClick={submit}
            className="gradient-bg text-white font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-all">
            Submit
          </button>
        </div>
      )}

      {result !== "correct" && (
        <button onClick={() => setShowHint(true)} disabled={showHint}
          className={`text-sm px-4 py-2 rounded-xl font-semibold transition-all ${showHint ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400" : "bg-muted hover:bg-muted/70 text-muted-foreground"}`}>
          💡 {showHint ? "Hint shown" : "Show Hint"}
        </button>
      )}

      {showHint && (
        <div className="mt-3 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 animate-fade-in">
          <p className="text-sm text-foreground">{current.hint}</p>
        </div>
      )}
    </div>
  );
}
