import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, RotateCcw, Trophy } from "lucide-react";
import { caesarShift, toNumber, toMorse } from "../../utils/ciphers";
import { addBonusXP } from "../../utils/xpSystem";
import { showToast } from "../../utils/toast";

interface Question { cipher: string; encrypted: string; answer: string; }

const WORDS = ["HELLO","CODE","MATHS","SPY","AGENT","CIPHER","SECRET","DECODE","LOCK","KEY","SAFE","STAR","ZERO","ALPHA","BRAVE","DELTA"];

function makeQ(): Question {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    const shift = 3 + Math.floor(Math.random() * 5);
    return { cipher: `Caesar (shift ${shift})`, encrypted: caesarShift(word, shift), answer: word };
  } else if (type === 1) {
    return { cipher: "Number Cipher", encrypted: toNumber(word), answer: word };
  } else {
    return { cipher: "Reverse Cipher", encrypted: word.split("").reverse().join(""), answer: word };
  }
}

export default function SpeedChallenge() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState<Question>(makeQ);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQ = useCallback(() => {
    setQuestion(makeQ());
    setAnswer("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished]);

  useEffect(() => {
    if (finished && score > 0) {
      const xp = score * 15;
      addBonusXP(xp);
      showToast(`⚡ Speed Challenge done! +${xp} XP`, "success");
    }
  }, [finished]);

  const submit = () => {
    if (!answer.trim()) return;
    if (answer.trim().toUpperCase() === question.answer.toUpperCase()) {
      setScore((s) => s + 1);
      setFlash("correct");
      setTimeout(() => setFlash(null), 300);
      nextQ();
    } else {
      setWrong((w) => w + 1);
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
      setAnswer("");
    }
  };

  const restart = () => {
    setStarted(false);
    setTimeLeft(30);
    setQuestion(makeQ());
    setAnswer("");
    setScore(0);
    setWrong(0);
    setFinished(false);
    setFlash(null);
  };

  const timerColor = timeLeft > 20 ? "bg-green-500" : timeLeft > 10 ? "bg-yellow-500" : "bg-red-500";

  if (finished) {
    const accuracy = score + wrong > 0 ? Math.round((score / (score + wrong)) * 100) : 0;
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="text-6xl mb-3">⚡</div>
        <h3 className="text-2xl font-black mb-1">Speed Challenge Complete!</h3>
        <p className="text-muted-foreground mb-5">30 seconds — how fast can you decode?</p>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
          <div className="bg-green-100 dark:bg-green-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-500">{score}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-red-500">{wrong}</div>
            <div className="text-xs text-muted-foreground">Wrong</div>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-primary">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
        <div className="mb-4 text-sm text-muted-foreground">
          {score === 0 ? "Practice more — you'll get faster!" : score < 5 ? "Good start! Try to beat your score." : score < 10 ? "Nice speed! You're getting good at this." : "🔥 Incredible speed! True cipher master!"}
        </div>
        <div className="mb-4 text-primary font-bold">+{score * 15} XP earned</div>
        <button onClick={restart}
          className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all mx-auto">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="text-center py-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-5 text-white">
          <div className="text-5xl mb-3">⚡</div>
          <h3 className="text-2xl font-black mb-2">Speed Challenge</h3>
          <p className="text-white/80 text-sm">Decode as many ciphers as you can in 30 seconds! Caesar, Number Cipher, and Reverse are in the mix.</p>
        </div>
        <div className="text-sm text-muted-foreground mb-5 space-y-1">
          <div>⏱ 30 second countdown</div>
          <div>✅ Each correct answer scores +1 point</div>
          <div>⭐ Each point earns 15 XP</div>
          <div>⌨️ Press Enter to submit each answer</div>
        </div>
        <button onClick={() => { setStarted(true); setTimeout(() => inputRef.current?.focus(), 100); }}
          className="gradient-bg text-white font-black px-10 py-4 rounded-2xl hover:opacity-90 transition-all hover:scale-105 active:scale-95 text-lg">
          ⚡ Start!
        </button>
      </div>
    );
  }

  return (
    <div className={`transition-colors duration-150 rounded-2xl ${flash === "correct" ? "bg-green-50 dark:bg-green-950/20" : flash === "wrong" ? "bg-red-50 dark:bg-red-950/20" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1 font-black text-primary">
            <Trophy className="w-4 h-4" /> {score}
          </div>
          <span className="text-muted-foreground">Wrong: {wrong}</span>
        </div>
        <div className={`flex items-center gap-1.5 font-black text-lg ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
          ⏱ {timeLeft}s
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2.5 mb-5">
        <div className={`h-2.5 rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${(timeLeft / 30) * 100}%` }} />
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-5 mb-4 text-white text-center">
        <div className="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">{question.cipher}</div>
        <div className="text-3xl font-black font-mono tracking-widest">{question.encrypted}</div>
      </div>

      <div className="flex gap-2">
        <input ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Decode and press Enter..."
          className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
        />
        <button onClick={submit}
          className="gradient-bg text-white font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-all">
          <Zap className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        Press <kbd className="bg-muted border border-border rounded px-1 font-mono">Enter</kbd> to submit • Keep going!
      </div>
    </div>
  );
}
