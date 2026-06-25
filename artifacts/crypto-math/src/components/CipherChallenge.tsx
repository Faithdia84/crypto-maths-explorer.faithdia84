import { useState, useEffect, useRef } from "react";
import { Trophy, RotateCcw, Zap, Target, Star } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

function caesarEncrypt(text: string, shift: number): string {
  return text.split("").map((c) => {
    if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
    return c;
  }).join("");
}

function toNumber(text: string): string {
  return text.split("").map((c) => /[A-Z]/.test(c) ? String(c.charCodeAt(0) - 64) : c).join(" ");
}

function toReverse(text: string): string { return text.split("").reverse().join(""); }

const WORD_POOLS: Record<Difficulty, string[]> = {
  easy:   ["CAT", "DOG", "SUN", "FUN", "HAT", "BIG", "RED", "MAP", "NET", "CUP"],
  medium: ["MATHS", "CODES", "LOCK", "SHIFT", "PRIME", "LEARN", "SMART", "BRAIN"],
  hard:   ["CRYPTOGRAPHY", "MATHEMATICS", "ENCRYPTION", "ALGORITHM", "MODULAR", "BINARY"],
};

type ChallengeType = "caesar" | "number" | "reverse";

interface Challenge {
  original: string;
  encrypted: string;
  type: ChallengeType;
  hint: string;
  shift?: number;
  points: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; points: number; emoji: string }> = {
  easy:   { label: "Easy",   color: "from-green-400 to-teal-500",   points: 10, emoji: "🌱" },
  medium: { label: "Medium", color: "from-yellow-400 to-orange-500", points: 20, emoji: "⚡" },
  hard:   { label: "Hard",   color: "from-red-400 to-rose-600",      points: 30, emoji: "🔥" },
};

function generateChallenge(difficulty: Difficulty): Challenge {
  const words = WORD_POOLS[difficulty];
  const word = words[Math.floor(Math.random() * words.length)];
  const types: ChallengeType[] = difficulty === "easy" ? ["reverse", "number"] : ["caesar", "number", "reverse"];
  const type = types[Math.floor(Math.random() * types.length)];
  const points = DIFFICULTY_CONFIG[difficulty].points;

  if (type === "caesar") {
    const shift = difficulty === "medium" ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 10) + 5;
    return {
      original: word, encrypted: caesarEncrypt(word, shift), type, shift,
      hint: `Caesar Cipher — each letter shifted forward by ${shift}`,
      points,
    };
  }
  if (type === "number") {
    return {
      original: word, encrypted: toNumber(word), type,
      hint: "Number Cipher — A=1, B=2, C=3 … Z=26",
      points,
    };
  }
  return {
    original: word, encrypted: toReverse(word), type,
    hint: "Reverse Cipher — just flip the letters!",
    points,
  };
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
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [bonusMsg, setBonusMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = (d: Difficulty) => {
    setDifficulty(d);
    setChallenge(generateChallenge(d));
    setScore(0); setRound(1); setUserInput("");
    setStatus("playing"); setShowHint(false); setStreak(0); setTotalAttempts(0);
    setBonusMsg("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = () => {
    if (!challenge || status !== "playing") return;
    const trimmed = userInput.trim().toUpperCase();
    setTotalAttempts((a) => a + 1);
    if (trimmed === challenge.original) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      let pts = challenge.points;
      if (newStreak >= 3) { pts = Math.round(pts * 1.5); setBonusMsg(`🔥 ${newStreak}x streak! +${pts} pts`); }
      else { setBonusMsg(`+${pts} pts`); }
      setScore((s) => s + pts);
      setStatus("correct");
    } else {
      setStreak(0); setBonusMsg("");
      setStatus("wrong");
    }
  };

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) { setStatus("finished"); return; }
    setRound((r) => r + 1);
    setChallenge(generateChallenge(difficulty!));
    setUserInput(""); setStatus("playing"); setShowHint(false); setBonusMsg("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const getCipherLabel = (type: ChallengeType) =>
    type === "caesar" ? "Caesar Cipher 🔐" : type === "number" ? "Number Cipher 🔢" : "Reverse Cipher ↔️";

  if (!difficulty) {
    return (
      <section id="challenge" className="py-20 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Mini Game
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Cipher <span className="gradient-text">Challenge</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Can you crack the codes? You'll be given {TOTAL_ROUNDS} encrypted words. Decode them correctly to earn points! Build streaks for bonus points!
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              return (
                <button key={d} onClick={() => startGame(d)}
                  className={`bg-gradient-to-br ${cfg.color} text-white rounded-2xl p-6 text-center hover:scale-105 active:scale-95 transition-all shadow-lg card-hover`}>
                  <div className="text-4xl mb-3">{cfg.emoji}</div>
                  <div className="font-black text-xl mb-1">{cfg.label}</div>
                  <div className="text-white/80 text-sm">{cfg.points} pts/question</div>
                  <div className="text-white/70 text-xs mt-1">
                    {d === "easy" ? "Short words" : d === "medium" ? "Medium words" : "Long words, high shifts"}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 text-sm text-muted-foreground">
            <h4 className="font-bold text-foreground mb-3 flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" /> How to Play
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: "🔐", text: "You'll see an encrypted word" },
                { icon: "🧠", text: "Figure out the cipher type and decode it" },
                { icon: "🏆", text: "Build streaks for 1.5× bonus points" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (status === "finished") {
    const accuracy = Math.round((totalAttempts > 0 ? (round / totalAttempts) : 0) * 100);
    const maxScore = TOTAL_ROUNDS * DIFFICULTY_CONFIG[difficulty].points;
    const pct = Math.round((score / maxScore) * 100);

    return (
      <section id="challenge" className="py-20 px-4 bg-background">
        <div className="max-w-lg mx-auto text-center animate-slide-in-up">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-black mb-2">Challenge Complete!</h2>
          <div className="text-6xl font-black gradient-text mb-2">{score} pts</div>
          <div className="text-muted-foreground mb-2">{pct}% of maximum ({maxScore} pts)</div>
          <div className="text-sm text-muted-foreground mb-8">
            Difficulty: <strong>{DIFFICULTY_CONFIG[difficulty].label}</strong> · {TOTAL_ROUNDS} rounds
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Score", value: score, icon: "🏆" },
              { label: "Rounds", value: `${TOTAL_ROUNDS}/${TOTAL_ROUNDS}`, icon: "🎯" },
              { label: "Best Streak", value: streak, icon: "🔥" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-black text-xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => startGame(difficulty)}
              className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all hover:scale-105">
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={() => setDifficulty(null)}
              className="flex items-center gap-2 bg-muted text-foreground font-bold px-6 py-3 rounded-full hover:bg-muted/70 transition-all hover:scale-105">
              <Target className="w-4 h-4" /> Change Difficulty
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!challenge) return null;

  return (
    <section id="challenge" className="py-20 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black mb-2">
            Cipher <span className="gradient-text">Challenge</span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className={`bg-gradient-to-r ${DIFFICULTY_CONFIG[difficulty].color} text-white px-3 py-1 rounded-full font-bold`}>
              {DIFFICULTY_CONFIG[difficulty].emoji} {DIFFICULTY_CONFIG[difficulty].label}
            </span>
            <span className="text-muted-foreground">Round {round}/{TOTAL_ROUNDS}</span>
            <span className="font-bold text-primary">🏆 {score} pts</span>
          </div>
        </div>

        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all ${
              i < round - 1 ? "bg-green-400" : i === round - 1 ? "gradient-bg" : "bg-muted"
            }`} />
          ))}
        </div>

        {streak >= 2 && status === "playing" && (
          <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-xl p-3 mb-4 text-center text-sm font-bold text-orange-700 dark:text-orange-300 animate-pulse">
            🔥 {streak} streak! Keep going for bonus points!
          </div>
        )}

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="text-center mb-6">
            <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              {getCipherLabel(challenge.type)}
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-primary mb-2">
              {challenge.encrypted}
            </div>
            <div className="text-sm text-muted-foreground">Decode this encrypted word</div>
          </div>

          {status === "playing" && (
            <>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type your answer..."
                className="w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-center text-xl font-mono font-bold focus:outline-none focus:border-primary mb-4 uppercase"
              />
              <div className="flex gap-3 mb-4">
                <button onClick={handleSubmit} disabled={!userInput.trim()}
                  className="flex-1 gradient-bg text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" /> Submit Answer
                </button>
              </div>
              <button onClick={() => setShowHint(!showHint)}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors py-2">
                {showHint ? "Hide" : "Show"} Hint 💡
              </button>
              {showHint && (
                <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-3 text-sm text-yellow-800 dark:text-yellow-200 animate-fade-in">
                  💡 {challenge.hint}
                </div>
              )}
            </>
          )}

          {status === "correct" && (
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-3">🎉</div>
              <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-2">Correct!</div>
              {bonusMsg && <div className="text-lg font-bold text-primary mb-2">{bonusMsg}</div>}
              <div className="text-muted-foreground mb-4">The answer was <strong>{challenge.original}</strong></div>
              <button onClick={nextRound} className="gradient-bg text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105">
                {round < TOTAL_ROUNDS ? "Next Challenge →" : "See Final Score 🏆"}
              </button>
            </div>
          )}

          {status === "wrong" && (
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-3">😔</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 mb-2">Not quite!</div>
              <div className="text-muted-foreground mb-2">The answer was <strong className="text-foreground">{challenge.original}</strong></div>
              <div className="text-sm text-muted-foreground mb-4 bg-muted rounded-xl p-3">{challenge.hint}</div>
              <button onClick={nextRound} className="bg-muted text-foreground font-bold px-8 py-3 rounded-xl hover:bg-muted/70 transition-all">
                {round < TOTAL_ROUNDS ? "Next Challenge →" : "See Final Score 🏆"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
