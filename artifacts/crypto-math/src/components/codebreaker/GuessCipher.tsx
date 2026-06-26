import { useState, useCallback } from "react";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { getCBStats, saveCBStats } from "../../utils/cbData";
import { showToast } from "../../utils/toast";

interface Question {
  encrypted: string;
  cipher: string;
  explanation: string;
  options: string[];
}

const ALL_QUESTIONS: Question[] = [
  {
    encrypted: "KHOOR",
    cipher: "Caesar Cipher",
    explanation: "This is a Caesar Cipher! Each letter was shifted forward by 3 positions: H→K, E→H, L→O, L→O, O→R. Caesar ciphers always shift letters by a fixed number.",
    options: ["Caesar Cipher", "Number Cipher", "Morse Code", "Binary Code"],
  },
  {
    encrypted: "8 5 12 12 15",
    cipher: "Number Cipher",
    explanation: "Number Cipher! Each letter becomes its position in the alphabet: H=8, E=5, L=12, L=12, O=15. You can tell because the values are all between 1 and 26.",
    options: ["Reverse Cipher", "Number Cipher", "Symbol Cipher", "Caesar Cipher"],
  },
  {
    encrypted: ".... . .-.. .-.. ---",
    cipher: "Morse Code",
    explanation: "Morse Code! Dots (.) and dashes (-) represent letters: H=...., E=., L=.-.., L=.-.., O=---. The pattern of dots and dashes is the key giveaway.",
    options: ["Caesar Cipher", "Binary Code", "Morse Code", "Symbol Cipher"],
  },
  {
    encrypted: "DLROW",
    cipher: "Reverse Cipher",
    explanation: "Reverse Cipher! The message 'WORLD' has simply been reversed to get 'DLROW'. Reverse ciphers are easy to spot — try reading it backwards!",
    options: ["Reverse Cipher", "Caesar Cipher", "Number Cipher", "Morse Code"],
  },
  {
    encrypted: "? & - - <",
    cipher: "Symbol Cipher",
    explanation: "Symbol Cipher! Each letter was replaced with a symbol: H→?, E→&, L→-, L→-, O→<. Symbols replacing letters is the hallmark of a substitution cipher.",
    options: ["Binary Code", "Symbol Cipher", "Reverse Cipher", "Number Cipher"],
  },
  {
    encrypted: "01001000 01001001",
    cipher: "Binary Code",
    explanation: "Binary Code! Each 8-digit group of 0s and 1s is one letter in ASCII. 01001000=72=H and 01001001=73=I. Binary is recognisable by the groups of 8 digits with only 0s and 1s.",
    options: ["Morse Code", "Number Cipher", "Symbol Cipher", "Binary Code"],
  },
  {
    encrypted: "JGNNQ",
    cipher: "Caesar Cipher",
    explanation: "Caesar Cipher with a shift of 2! H+2=J, E+2=G, L+2=N, L+2=N, O+2=Q → JGNNQ. The letters look shifted but still appear as normal alphabet letters, which hints at Caesar.",
    options: ["Caesar Cipher", "Reverse Cipher", "Morse Code", "Binary Code"],
  },
  {
    encrypted: "19 5 3 18 5 20",
    cipher: "Number Cipher",
    explanation: "Number Cipher! S=19, E=5, C=3, R=18, E=5, T=20 → SECRET. Numbers between 1–26 separated by spaces are a strong clue for the Number Cipher.",
    options: ["Number Cipher", "Binary Code", "Symbol Cipher", "Caesar Cipher"],
  },
  {
    encrypted: "- . .- -- / .- --. . -. -",
    cipher: "Morse Code",
    explanation: "Morse Code! T=-, E=., A=.-, M=-- / A=.-, G=--., E=., N=-., T=- → TEAM AGENT. The dots, dashes, and slashes for word gaps are classic Morse Code.",
    options: ["Symbol Cipher", "Caesar Cipher", "Morse Code", "Reverse Cipher"],
  },
  {
    encrypted: "; > ( 0 1 0 0 0 0 0 1",
    cipher: "Symbol Cipher",
    explanation: "Symbol Cipher! S=;, P=>, Y=( → SPY. Symbols that don't look like letters or numbers are the hallmark of a symbol substitution cipher.",
    options: ["Binary Code", "Number Cipher", "Symbol Cipher", "Morse Code"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateRound(): Question[] {
  return shuffle(ALL_QUESTIONS).slice(0, 6);
}

export default function GuessCipher() {
  const [questions, setQuestions] = useState<Question[]>(() => generateRound());
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  const pick = (option: string) => {
    if (result !== null) return;
    setSelected(option);
    const isRight = option === q.cipher;
    setResult(isRight ? "correct" : "wrong");
    if (isRight) {
      setScore((s) => s + 50);
      setCorrect((c) => c + 1);
      showToast("✅ Correct!", "success");
      const s = getCBStats();
      s.guessCipherCorrect += 1;
      saveCBStats(s);
    } else {
      showToast("❌ Not quite! Read the explanation.", "error");
    }
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setResult(null);
    } else {
      setFinished(true);
    }
  };

  const restart = useCallback(() => {
    setQuestions(generateRound());
    setIdx(0);
    setSelected(null);
    setResult(null);
    setScore(0);
    setCorrect(0);
    setFinished(false);
  }, []);

  if (finished) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🎖️" : "💪"}</div>
        <h3 className="text-2xl font-black mb-2">Round Complete!</h3>
        <p className="text-muted-foreground mb-6">{correct} / {questions.length} correct — {pct}%</p>
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-primary">{score}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-500">{correct}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {pct === 100 ? "Perfect score! You're a cipher master! 🧠" : pct >= 80 ? "Great job! You really know your ciphers!" : "Keep practising — each cipher has unique patterns to spot!"}
        </p>
        <button onClick={restart}
          className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all mx-auto">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 mb-5 text-white">
        <h3 className="text-xl font-black mb-1">🎮 Guess the Cipher!</h3>
        <p className="text-white/80 text-sm">Look at the encrypted message and identify which cipher was used.</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Question {idx + 1} of {questions.length}</span>
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Trophy className="w-4 h-4" /> {score} pts
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-5 shadow-sm">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Encrypted Message</div>
        <div className="text-xl sm:text-2xl font-black font-mono text-center bg-muted rounded-xl px-4 py-4 break-all mb-1">
          {q.encrypted}
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">Which cipher created this?</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.cipher;
          let cls = "border-border bg-card hover:bg-muted text-foreground";
          if (result !== null) {
            if (isCorrect) cls = "border-green-400 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300";
            else if (isSelected && !isCorrect) cls = "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400";
            else cls = "border-border bg-card text-muted-foreground opacity-60";
          }
          return (
            <button key={opt} onClick={() => pick(opt)}
              className={`border-2 rounded-2xl px-4 py-4 font-semibold text-sm text-center transition-all card-hover ${cls}`}>
              {result !== null && isCorrect && <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />}
              {result !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 inline mr-1 text-red-500" />}
              {opt}
            </button>
          );
        })}
      </div>

      {result !== null && (
        <div className={`rounded-2xl p-4 mb-4 animate-fade-in ${result === "correct" ? "bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800"}`}>
          <div className={`font-black mb-2 ${result === "correct" ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-400"}`}>
            {result === "correct" ? "✅ Correct!" : `❌ Not quite! It was ${q.cipher}`}
          </div>
          <p className="text-sm text-foreground">{q.explanation}</p>
        </div>
      )}

      {result !== null && (
        <button onClick={next}
          className="gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm">
          {idx < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
        </button>
      )}
    </div>
  );
}
