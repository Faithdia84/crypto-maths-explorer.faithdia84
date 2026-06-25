import { useState } from "react";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "What does the word 'cryptography' come from?",
    options: ["Latin: 'write fast'", "Greek: 'hidden writing'", "French: 'secret art'", "Arabic: 'number code'"],
    answer: 1,
    explanation: "Cryptography comes from Greek: 'kryptos' (hidden) + 'graphein' (to write) = hidden writing!",
  },
  {
    q: "In Caesar Cipher with shift 3, what does 'A' become?",
    options: ["B", "C", "D", "X"],
    answer: 2,
    explanation: "A is position 1. Add shift 3 → position 4 = D. So A → D!",
  },
  {
    q: "Which mathematical concept helps letters wrap around at Z?",
    options: ["Multiplication", "Division", "Modular arithmetic", "Square roots"],
    answer: 2,
    explanation: "Modular arithmetic (clock maths) wraps Z (26) + 3 = 29, and 29 mod 26 = 3 = C. So Z → C!",
  },
  {
    q: "Julius Caesar used his cipher to communicate with his…",
    options: ["Family members", "Generals and army", "Business partners", "Roman senators"],
    answer: 1,
    explanation: "Julius Caesar used the cipher to send secret messages to his generals during military campaigns!",
  },
  {
    q: "If 'KHOOR' was encrypted with shift 3, what is the original?",
    options: ["WORLD", "HELLO", "MATHS", "CODES"],
    answer: 1,
    explanation: "Decrypt KHOOR with shift 3: K→H, H→E, O→L, O→L, R→O = HELLO!",
  },
  {
    q: "In a Number Cipher (A=1, B=2…), what is HELLO in numbers?",
    options: ["7 4 11 11 14", "8 5 12 12 15", "9 6 13 13 16", "1 2 3 4 5"],
    answer: 1,
    explanation: "H=8, E=5, L=12, L=12, O=15. So HELLO = 8 5 12 12 15!",
  },
  {
    q: "What does SOS look like in Morse Code?",
    options: ["--- ... ---", "... --- ...", ".- ... -.", ". - . - ."],
    answer: 1,
    explanation: "SOS in Morse is ... (S) --- (O) ... (S). It's the universal distress signal!",
  },
  {
    q: "What is the Reverse Cipher of 'MATHS'?",
    options: ["SHTAM", "SMATH", "AMTHS", "SHMAT"],
    answer: 0,
    explanation: "Reverse cipher simply reverses the letters. MATHS → SHTAM!",
  },
  {
    q: "Which famous mathematician broke the Enigma machine in WW2?",
    options: ["Albert Einstein", "Isaac Newton", "Alan Turing", "Carl Gauss"],
    answer: 2,
    explanation: "Alan Turing cracked the Enigma cipher, shortening WW2 and saving millions of lives. He's also the father of computer science!",
  },
  {
    q: "What does 'A' look like in Binary?",
    options: ["10000001", "01000001", "11000001", "00100001"],
    answer: 1,
    explanation: "A has ASCII code 65. In 8-bit binary, 65 = 01000001. Binary uses only 0s and 1s!",
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleSelect = (idx: number) => { if (!submitted) setSelected(idx); };

  const handleSubmit = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1); setSelected(null); setSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrent(0); setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false); setSubmitted(false);
  };

  const pct = Math.round((score / questions.length) * 100);
  const getMsg = () => {
    if (score === 10) return "Perfect score! You're a cryptography genius! 🏆";
    if (score >= 8)  return "Excellent! Outstanding performance! ⭐";
    if (score >= 6)  return "Good job! You know your ciphers! 👍";
    if (score >= 4)  return "Not bad! Keep studying cryptography! 📚";
    return "Keep trying! Cryptography takes practice! 💪";
  };

  if (showResult) {
    return (
      <section id="quiz" className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center animate-slide-in-up">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
          <div className="text-7xl font-black mb-2" style={{
            background: `linear-gradient(135deg, ${score >= 7 ? "#10b981" : score >= 5 ? "#f59e0b" : "#ef4444"}, ${score >= 7 ? "#3b82f6" : score >= 5 ? "#f97316" : "#ef4444"})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            {score}/{questions.length}
          </div>
          <div className="text-lg text-muted-foreground mb-2">{pct}% correct</div>
          <p className="text-xl mb-8">{getMsg()}</p>

          <div className="w-full bg-muted rounded-full h-4 mb-8 overflow-hidden">
            <div
              className="h-4 rounded-full gradient-bg transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {questions.map((q, i) => (
              <div key={i} className={`rounded-xl p-3 text-center ${
                answers[i] === q.answer
                  ? "bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700"
                  : "bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700"
              }`}>
                <div className="text-xl mb-1">{answers[i] === q.answer ? "✅" : "❌"}</div>
                <div className="text-xs font-bold text-muted-foreground">Q{i + 1}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-8 text-left">
            {questions.map((q, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border text-sm">
                <div className="font-semibold mb-1">{q.q}</div>
                <div className={`text-xs mb-1 font-medium ${answers[i] === q.answer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  Your answer: {q.options[answers[i] ?? 0]}
                  {answers[i] !== q.answer && <span className="text-green-600 dark:text-green-400"> | Correct: {q.options[q.answer]}</span>}
                </div>
                <div className="text-xs text-muted-foreground italic">{q.explanation}</div>
              </div>
            ))}
          </div>

          <button onClick={restart} className="inline-flex items-center gap-2 gradient-bg text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-all hover:scale-105">
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-20 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Test Your Knowledge
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-2">
            Cryptography <span className="gradient-text">Quiz</span>
          </h2>
          <p className="text-muted-foreground">10 questions · All cipher types covered</p>
        </div>

        <div className="flex gap-1.5 mb-6">
          {questions.map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${
              i < current ? "bg-green-400" : i === current ? "gradient-bg" : "bg-muted"
            }`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-muted-foreground">Question {current + 1} of {questions.length}</span>
            <span className="text-sm font-semibold bg-muted px-3 py-1 rounded-full">
              🏆 {answers.filter((a, i) => a !== null && a === questions[i].answer).length} correct
            </span>
          </div>

          <h3 className="text-xl font-bold mb-6">{q.q}</h3>

          <div className="space-y-3 mb-6">
            {q.options.map((opt, idx) => {
              let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
              if (!submitted) {
                cls += selected === idx
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted hover:border-primary/50 hover:bg-muted/70";
              } else {
                if (idx === q.answer) cls += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300";
                else if (idx === selected && selected !== q.answer) cls += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                else cls += "border-border bg-muted opacity-50";
              }
              return (
                <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-left">{opt}</span>
                    {submitted && idx === q.answer && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                    {submitted && idx === selected && selected !== q.answer && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={`rounded-xl p-4 mb-4 text-sm animate-fade-in ${
              selected === q.answer
                ? "bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700"
            }`}>
              <div className="font-bold mb-1">{selected === q.answer ? "✅ Correct!" : "❌ Incorrect!"}</div>
              <div className="text-muted-foreground">{q.explanation}</div>
            </div>
          )}

          {!submitted ? (
            <button onClick={handleSubmit} disabled={selected === null}
              className="w-full gradient-bg text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-all">
              Submit Answer
            </button>
          ) : (
            <button onClick={handleContinue} className="w-full gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all">
              {current < questions.length - 1 ? "Next Question →" : "See Final Results 🏆"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
