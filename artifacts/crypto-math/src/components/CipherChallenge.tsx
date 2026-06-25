import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, RotateCcw, Zap, Target, Star, Clock } from "lucide-react";
import { caesarShift, toNumber, MORSE } from "../utils/ciphers";
import { recordChallengeScore } from "../utils/stats";
import { showToast } from "../utils/toast";

type Difficulty = "easy" | "medium" | "hard";

function toReverse(text: string) { return text.split("").reverse().join(""); }
type ChallengeType = "caesar" | "number" | "reverse";

const WORD_POOLS: Record<Difficulty, string[]> = {
  easy:   ["CAT", "DOG", "SUN", "FUN", "HAT", "BIG", "RED", "MAP", "NET", "CUP"],
  medium: ["MATHS", "CODES", "LOCK", "SHIFT", "PRIME", "LEARN", "SMART", "BRAIN"],
  hard:   ["CRYPTOGRAPHY", "MATHEMATICS", "ENCRYPTION", "ALGORITHM", "MODULAR", "BINARY"],
};

interface Challenge { original: string; encrypted: string; type: ChallengeType; hint: string; shift?: number; points: number; }

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; points: number; emoji: string; seconds: number }> = {
  easy:   { label: "Easy",   color: "from-green-400 to-teal-500",    points: 10, emoji: "🌱", seconds: 45 },
  medium: { label: "Medium", color: "from-yellow-400 to-orange-500", points: 20, emoji: "⚡", seconds: 30 },
  hard:   { label: "Hard",   color: "from-red-400 to-rose-600",      points: 30, emoji: "🔥", seconds: 20 },
};

function generateChallenge(difficulty: Difficulty): Challenge {
  const words = WORD_POOLS[difficulty];
  const word = words[Math.floor(Math.random() * words.length)];
  const types: ChallengeType[] = difficulty === "easy" ? ["reverse", "number"] : ["caesar", "number", "reverse"];
  const type = types[Math.floor(Math.random() * types.length)];
  const points = DIFFICULTY_CONFIG[difficulty].points;
  if (type === "caesar") {
    const shift = difficulty === "medium" ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 10) + 5;
    return { original: word, encrypted: caesarShift(word, shift), type, shift, hint: `Caesar Cipher — each letter shifted by ${shift}`, points };
  }
  if (type === "number") {
    return { original: word, encrypted: toNumber(word), type, hint: "Number Cipher — A=1, B=2 … Z=26", points };
  }
  return { original: word, encrypted: toReverse(word), type, hint: "Reverse Cipher — flip the letters!", points };
}

const TOTAL_ROUNDS = 5;

export default function CipherChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong" | "finished">("playing");
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bonusMsg, setBonusMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback((seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          setStatus("wrong");
          setStreak(0);
          showToast("Time's up! ⏱️", "error");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const startGame = (d: Difficulty) => {
    const c = generateChallenge(d);
    setDifficulty(d); setChallenge(c); setScore(0); setRound(1);
    setUserInput(""); setStatus("playing"); setShowHint(false); setStreak(0); setBestStreak(0); setBonusMsg("");
    startTimer(DIFFICULTY_CONFIG[d].seconds);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = () => {
    if (!challenge || status !== "playing") return;
    stopTimer();
    const trimmed = userInput.trim().toUpperCase();
    if (trimmed === challenge.original) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      let pts = challenge.points;
      const timeBonus = Math.round(timeLeft * 0.5);
      pts += timeBonus;
      if (newStreak >= 3) { pts = Math.round(pts * 1.5); setBonusMsg(`🔥 ${newStreak}x streak! +${pts} pts (incl. time bonus)`); }
      else { setBonusMsg(`+${pts} pts${timeBonus > 0 ? ` (${timeBonus} time bonus)` : ""}`); }
      setScore((s) => s + pts);
      setStatus("correct");
      showToast("Correct! 🎉", "success");
    } else {
      setStreak(0); setBonusMsg("");
      setStatus("wrong");
      showToast("Not quite! Check the hint.", "error");
    }
  };

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS || status === "finished") {
      setStatus("finished");
      if (difficulty) { recordChallengeScore(score, DIFFICULTY_CONFIG[difficulty].label); }
      return;
    }
    const nextC = generateChallenge(difficulty!);
    setRound((r) => r + 1); setChallenge(nextC);
    setUserInput(""); setStatus("playing"); setShowHint(false); setBonusMsg("");
    startTimer(DIFFICULTY_CONFIG[difficulty!].seconds);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const getCipherLabel = (type: ChallengeType) =>
    type === "caesar" ? "Caesar Cipher 🔐" : type === "number" ? "Number Cipher 🔢" : "Reverse Cipher ↔️";

  const cfg = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;
  const timerPct = cfg && challenge ? (timeLeft / cfg.seconds) * 100 : 100;
  const timerColor = timeLeft > 10 ? "bg-green-500" : timeLeft > 5 ? "bg-yellow-500" : "bg-red-500";

  if (!difficulty) {
    return (
      <section id="challenge" className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">Mini Game</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Cipher <span className="gradient-text">Challenge</span></h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Decode encrypted words against the clock! Build streaks for bonus points. Time bonuses for fast answers!
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const c = DIFFICULTY_CONFIG[d];
              return (
                <button key={d} onClick={() => startGame(d)}
                  className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-6 text-center hover:scale-105 active:scale-95 transition-all shadow-lg`}>
                  <div className="text-4xl mb-2">{c.emoji}</div>
                  <div className="font-black text-xl mb-1">{c.label}</div>
                  <div className="text-white/80 text-sm">{c.points} pts/question</div>
                  <div className="text-white/70 text-xs mt-1 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" /> {c.seconds}s per round
                  </div>
                </button>
              );
            })}
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: "🔐", text: "See an encrypted word" },
                { icon: "⏱️", text: "Race against the timer" },
                { icon: "🏆", text: "Streaks = 1.5× bonus points" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2"><span>{item.icon}</span><span>{item.text}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (status === "finished") {
    const maxScore = TOTAL_ROUNDS * cfg!.points;
    const pct = Math.round((score / maxScore) * 100);
    return (
      <section id="challenge" className="py-20 px-4 bg-muted/30">
        <div className="max-w-lg mx-auto text-center animate-slide-in-up">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-black mb-2">Challenge Complete!</h2>
          <div className="text-6xl font-black gradient-text mb-2">{score} pts</div>
          <div className="text-muted-foreground mb-8">{pct}% of max · {DIFFICULTY_CONFIG[difficulty].label} difficulty</div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Score", value: score, icon: "🏆" },
              { label: "Rounds", value: `${TOTAL_ROUNDS}/${TOTAL_ROUNDS}`, icon: "🎯" },
              { label: "Best Streak", value: bestStreak, icon: "🔥" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-xl">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => startGame(difficulty)}
              className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-full hover:opacity-90 hover:scale-105">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={() => { setDifficulty(null); setStatus("playing"); }}
              className="flex items-center gap-2 bg-muted font-bold px-6 py-3 rounded-full hover:bg-muted/70 hover:scale-105">
              <Target className="w-4 h-4" /> Change Difficulty
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!challenge) return null;

  return (
    <section id="challenge" className="py-20 px-4 bg-muted/30">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black mb-2">Cipher <span className="gradient-text">Challenge</span></h2>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className={`bg-gradient-to-r ${cfg!.color} text-white px-3 py-1 rounded-full font-bold`}>{cfg!.emoji} {cfg!.label}</span>
            <span className="text-muted-foreground">Round {round}/{TOTAL_ROUNDS}</span>
            <span className="font-bold text-primary">🏆 {score} pts</span>
          </div>
        </div>

        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i < round - 1 ? "bg-green-400" : i === round - 1 ? "gradient-bg" : "bg-muted"}`} />
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1 font-semibold">
              <Clock className="w-4 h-4" />
              <span className={timeLeft <= 5 ? "text-red-500 animate-pulse" : timeLeft <= 10 ? "text-yellow-500" : ""}>{timeLeft}s</span>
            </div>
            {streak >= 2 && <span className="text-orange-500 font-bold text-xs">🔥 {streak} streak!</span>}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-2 ${timerColor} rounded-full transition-all duration-1000`} style={{ width: `${timerPct}%` }} />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="text-center mb-6">
            <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">{getCipherLabel(challenge.type)}</div>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-primary mb-2">{challenge.encrypted}</div>
            <div className="text-sm text-muted-foreground">Decode this encrypted word</div>
          </div>

          {status === "playing" && (
            <>
              <input ref={inputRef} type="text" value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type your answer..."
                className="w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-center text-xl font-mono font-bold focus:outline-none focus:border-primary mb-4 uppercase" />
              <div className="flex gap-3 mb-3">
                <button onClick={handleSubmit} disabled={!userInput.trim()}
                  className="flex-1 gradient-bg text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" /> Submit
                </button>
              </div>
              <button onClick={() => setShowHint(!showHint)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors py-2">
                {showHint ? "Hide" : "Show"} Hint 💡
              </button>
              {showHint && (
                <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-3 text-sm animate-fade-in">
                  💡 {challenge.hint}
                </div>
              )}
            </>
          )}

          {status === "correct" && (
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-3">🎉</div>
              <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">Correct!</div>
              {bonusMsg && <div className="text-lg font-bold text-primary mb-3">{bonusMsg}</div>}
              <div className="text-muted-foreground mb-4">Answer: <strong>{challenge.original}</strong></div>
              <button onClick={nextRound} className="gradient-bg text-white font-bold px-8 py-3 rounded-xl hover:opacity-90">
                {round < TOTAL_ROUNDS ? "Next →" : "See Score 🏆"}
              </button>
            </div>
          )}

          {status === "wrong" && (
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-3">{timeLeft === 0 ? "⏱️" : "😔"}</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 mb-1">{timeLeft === 0 ? "Time's Up!" : "Not quite!"}</div>
              <div className="text-muted-foreground mb-2">Answer: <strong className="text-foreground">{challenge.original}</strong></div>
              <div className="text-sm text-muted-foreground bg-muted rounded-xl p-3 mb-4">{challenge.hint}</div>
              <button onClick={nextRound} className="bg-muted text-foreground font-bold px-8 py-3 rounded-xl hover:bg-muted/70">
                {round < TOTAL_ROUNDS ? "Next Round →" : "See Score 🏆"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
