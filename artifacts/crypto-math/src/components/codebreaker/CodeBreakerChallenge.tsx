import { useState, useEffect, useRef, useCallback } from "react";
import { Timer, Lightbulb, CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw } from "lucide-react";
import {
  EASY_CHALLENGES, MEDIUM_CHALLENGES, HARD_CHALLENGES,
  TIMER, POINTS, TIME_MULT, getCBStats, saveCBStats, checkAchievements,
  type Challenge,
} from "../../utils/cbData";
import { showToast } from "../../utils/toast";

type Difficulty = "easy" | "medium" | "hard";

const SETS: Record<Difficulty, Challenge[]> = {
  easy: EASY_CHALLENGES,
  medium: MEDIUM_CHALLENGES,
  hard: HARD_CHALLENGES,
};

const DIFF_COLORS: Record<Difficulty, string> = {
  easy: "from-green-500 to-teal-600",
  medium: "from-blue-500 to-indigo-600",
  hard: "from-red-500 to-rose-600",
};

function ExplanationCard({ ch }: { ch: Challenge }) {
  return (
    <div className="mt-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-left animate-fade-in">
      <div className="font-black text-blue-700 dark:text-blue-300 mb-1 text-sm uppercase tracking-wide">📚 How it works</div>
      <p className="text-sm text-foreground mb-2">{ch.howItWorks}</p>
      <div className="font-black text-purple-700 dark:text-purple-300 mb-1 text-sm uppercase tracking-wide">🔢 The Maths</div>
      <p className="text-sm text-foreground mb-2 font-mono bg-muted rounded-lg px-3 py-2">{ch.mathNote}</p>
      <div className="font-black text-green-700 dark:text-green-300 mb-1 text-sm uppercase tracking-wide">✅ Worked Example</div>
      <p className="text-sm font-mono text-foreground">{ch.example}</p>
    </div>
  );
}

export default function CodeBreakerChallenge() {
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER["easy"]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showExp, setShowExp] = useState(false);
  const [done, setDone] = useState(false);
  const [fastestTime, setFastestTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const challenges = SETS[diff];
  const ch = challenges[idx];
  const totalTime = TIMER[diff];

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(TIMER[diff]);
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          setResult("timeout");
          setShowExp(true);
          const s = getCBStats();
          s.incorrectAnswers += 1;
          saveCBStats(s);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diff]);

  useEffect(() => {
    setIdx(0);
    setAnswer("");
    setResult(null);
    setShowHint(false);
    setHintsUsed(0);
    setDone(false);
    setShowExp(false);
    startTimer();
    return clearTimer;
  }, [diff]);

  useEffect(() => {
    if (!done && result === null) {
      startTimer();
      setAnswer("");
      setShowHint(false);
      setShowExp(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [idx]);

  const submit = () => {
    if (!answer.trim() || result !== null) return;
    const isCorrect = answer.trim().toUpperCase() === ch.answer.toUpperCase();
    clearTimer();
    setRunning(false);
    setResult(isCorrect ? "correct" : "wrong");
    setShowExp(true);

    const s = getCBStats();
    if (isCorrect) {
      const timeBonus = Math.round(timeLeft * TIME_MULT[diff]);
      const hintPenalty = hintsUsed * 25;
      const pts = Math.max(0, POINTS[diff] + timeBonus - hintPenalty);
      const newScore = score + pts;
      setScore(newScore);
      setCorrect((c) => c + 1);
      const elapsed = totalTime - timeLeft;
      if (fastestTime === null || elapsed < fastestTime) setFastestTime(elapsed);

      s.correctAnswers += 1;
      s.totalScore += pts;
      s.highestScore = Math.max(s.highestScore, newScore);
      if (!s.completedChallenges.includes(ch.id)) s.completedChallenges.push(ch.id);
      if (s.fastestTime === null || elapsed < s.fastestTime) s.fastestTime = elapsed;

      const newAch = checkAchievements(s);
      for (const id of newAch) {
        s.unlockedAchievements.push(id);
        showToast(`🏆 Achievement unlocked!`, "success");
      }
      showToast(`✅ Correct! +${pts} points`, "success");
    } else {
      setWrong((w) => w + 1);
      s.incorrectAnswers += 1;
      showToast("❌ Not quite — check the explanation below!", "error");
    }
    s.hintsUsed += hintsUsed;
    saveCBStats(s);
  };

  const useHint = () => {
    if (showHint) return;
    setShowHint(true);
    setHintsUsed((h) => h + 1);
    showToast("💡 Hint revealed! (−25 pts penalty)", "info");
  };

  const next = () => {
    if (idx < challenges.length - 1) {
      setIdx((i) => i + 1);
      setResult(null);
    } else {
      setDone(true);
      clearTimer();
    }
  };

  const restart = () => {
    setIdx(0);
    setAnswer("");
    setResult(null);
    setShowHint(false);
    setHintsUsed(0);
    setDone(false);
    setShowExp(false);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    startTimer();
  };

  const timerPct = (timeLeft / totalTime) * 100;
  const timerColor = timerPct > 50 ? "bg-green-500" : timerPct > 25 ? "bg-yellow-500" : "bg-red-500";

  if (done) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="text-7xl mb-4">🎉</div>
        <h3 className="text-3xl font-black mb-2">Challenge Complete!</h3>
        <div className="text-muted-foreground mb-6">You finished all {diff} challenges</div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
          <div className="bg-green-100 dark:bg-green-900/40 rounded-2xl p-4">
            <div className="text-2xl font-black text-green-600 dark:text-green-400">{correct}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/40 rounded-2xl p-4">
            <div className="text-2xl font-black text-red-500">{wrong}</div>
            <div className="text-xs text-muted-foreground">Wrong</div>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-2xl p-4">
            <div className="text-2xl font-black text-primary">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={restart}
            className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
          {diff !== "hard" && (
            <button onClick={() => { setDiff(diff === "easy" ? "medium" : "hard"); }}
              className="flex items-center gap-2 bg-muted font-bold px-6 py-3 rounded-xl hover:bg-muted/70 transition-all">
              Try {diff === "easy" ? "Medium" : "Hard"} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button key={d} onClick={() => setDiff(d)}
            className={`px-5 py-2 rounded-xl font-bold text-sm capitalize transition-all ${diff === d ? `bg-gradient-to-r ${DIFF_COLORS[d]} text-white shadow-md` : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
            {d === "easy" ? "🟢" : d === "medium" ? "🟡" : "🔴"} {d.charAt(0).toUpperCase() + d.slice(1)} (60s / 45s / 30s)
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-muted-foreground">Challenge {idx + 1} of {challenges.length}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-primary font-bold">
            <Trophy className="w-4 h-4" /> {score} pts
          </div>
          <div className={`flex items-center gap-1 font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
            <Timer className="w-4 h-4" /> {timeLeft}s
          </div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div className={`h-2 rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
      </div>

      <div className={`bg-gradient-to-r ${DIFF_COLORS[diff]} rounded-2xl p-6 mb-5 text-white`}>
        <div className="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">{ch.cipher}</div>
        <div className="text-center">
          <div className="text-sm opacity-80 mb-2">Decode this message:</div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest bg-white/10 rounded-xl px-4 py-3 break-all">
            {ch.encrypted}
          </div>
        </div>
      </div>

      {result === "timeout" && (
        <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-700 rounded-2xl p-4 mb-4 text-center animate-fade-in">
          <div className="text-2xl mb-1">⏰</div>
          <div className="font-black text-red-600 dark:text-red-400">Time's Up!</div>
          <div className="text-sm text-muted-foreground">The answer was: <span className="font-mono font-bold text-foreground">{ch.answer}</span></div>
        </div>
      )}

      {result === "correct" && (
        <div className="bg-green-100 dark:bg-green-950/40 border border-green-300 dark:border-green-700 rounded-2xl p-4 mb-4 text-center animate-fade-in">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1" />
          <div className="font-black text-green-600 dark:text-green-400 text-lg">Correct! 🎉</div>
          <div className="text-sm text-muted-foreground">+{Math.max(0, POINTS[diff] + Math.round(timeLeft * TIME_MULT[diff]) - hintsUsed * 25)} points</div>
        </div>
      )}

      {result === "wrong" && (
        <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-700 rounded-2xl p-4 mb-4 text-center animate-fade-in">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-1" />
          <div className="font-black text-red-600 dark:text-red-400 text-lg">Try Again!</div>
          <div className="text-sm text-muted-foreground">The answer was: <span className="font-mono font-bold text-foreground">{ch.answer}</span></div>
        </div>
      )}

      {result === null && (
        <div className="flex gap-2 mb-4">
          <input ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type your decoded answer here..."
            className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
          />
          <button onClick={submit}
            className="gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95">
            Check
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {result === null && (
          <button onClick={useHint} disabled={showHint}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all ${showHint ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 cursor-default" : "bg-muted hover:bg-muted/70 text-muted-foreground"}`}>
            <Lightbulb className="w-4 h-4" /> {showHint ? "Hint shown (−25 pts)" : "Use Hint (−25 pts)"}
          </button>
        )}
        {result !== null && (
          <button onClick={next}
            className="flex items-center gap-2 gradient-bg text-white font-bold px-5 py-2 rounded-xl hover:opacity-90 transition-all text-sm">
            {idx < challenges.length - 1 ? <><ChevronRight className="w-4 h-4" /> Next Challenge</> : <><Trophy className="w-4 h-4" /> Finish</>}
          </button>
        )}
      </div>

      {showHint && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-4 animate-fade-in">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-yellow-700 dark:text-yellow-300 text-sm mb-1">Hint</div>
              <p className="text-sm text-foreground">{ch.hint}</p>
            </div>
          </div>
        </div>
      )}

      {showExp && <ExplanationCard ch={ch} />}
    </div>
  );
}
