import { useState } from "react";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "What does the word 'cryptography' come from?",
    options: [
      "Latin words meaning 'write fast'",
      "Greek words meaning 'hidden writing'",
      "French words meaning 'secret art'",
      "Arabic words meaning 'number code'",
    ],
    answer: 1,
    explanation: "Cryptography comes from Greek: 'kryptos' (hidden) + 'graphein' (to write). So it literally means 'hidden writing'!",
  },
  {
    q: "In Caesar Cipher with a shift of 3, what does the letter 'A' become?",
    options: ["B", "C", "D", "X"],
    answer: 2,
    explanation: "A is position 1. Adding shift 3 gives position 4, which is D. So A → D!",
  },
  {
    q: "Which mathematical operation helps letters 'wrap around' at the end of the alphabet?",
    options: ["Multiplication", "Division", "Modular arithmetic", "Square roots"],
    answer: 2,
    explanation: "Modular arithmetic (clock maths) lets us wrap around. Z (26) + 3 = 29, and 29 mod 26 = 3 = C. So Z → C!",
  },
  {
    q: "Julius Caesar used his cipher to communicate with his...",
    options: ["Family members", "Generals and army", "Business partners", "Roman senators"],
    answer: 1,
    explanation: "Julius Caesar used the cipher to send secret messages to his generals during military campaigns!",
  },
  {
    q: "If 'KHOOR' was encrypted with a shift of 3, what is the original message?",
    options: ["WORLD", "HELLO", "MATHS", "CODES"],
    answer: 1,
    explanation: "KHOOR decrypted with shift 3: K→H, H→E, O→L, O→L, R→O. The answer is HELLO!",
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

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
    setSubmitted(false);
  };

  const getScoreColor = () => {
    if (score >= 4) return "text-green-600 dark:text-green-400";
    if (score >= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreMsg = () => {
    if (score === 5) return "Perfect! You're a cryptography genius! 🏆";
    if (score === 4) return "Excellent work! Almost perfect! ⭐";
    if (score === 3) return "Good job! Keep studying cryptography! 👍";
    if (score === 2) return "Not bad! Read the math section again! 📚";
    return "Keep trying! Cryptography takes practice! 💪";
  };

  if (showResult) {
    return (
      <section id="quiz" className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center animate-slide-in-up">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
          <p className={`text-6xl font-black mb-4 ${getScoreColor()}`}>
            {score}/{questions.length}
          </p>
          <p className="text-xl text-muted-foreground mb-8">{getScoreMsg()}</p>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {questions.map((q, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 text-center ${
                  answers[i] === q.answer
                    ? "bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700"
                    : "bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700"
                }`}
              >
                <div className="text-2xl mb-1">
                  {answers[i] === q.answer ? "✅" : "❌"}
                </div>
                <div className="text-xs font-bold text-muted-foreground">Q{i + 1}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8 text-left">
            {questions.map((q, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border text-sm">
                <div className="font-semibold mb-1 text-foreground">{q.q}</div>
                <div className={`text-xs mb-1 ${answers[i] === q.answer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  Your answer: {q.options[answers[i] ?? 0]}
                  {answers[i] !== q.answer && ` | Correct: ${q.options[q.answer]}`}
                </div>
                <div className="text-xs text-muted-foreground italic">{q.explanation}</div>
              </div>
            ))}
          </div>

          <button
            onClick={restart}
            className="inline-flex items-center gap-2 gradient-bg text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          >
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
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Interactive <span className="gradient-text">Quiz</span>
          </h2>
        </div>

        <div className="flex gap-2 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < current
                  ? "bg-green-400"
                  : i === current
                  ? "gradient-bg"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-muted-foreground">
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold bg-muted px-3 py-1 rounded-full">
              🏆 Score: {answers.filter((a, i) => a !== null && a === questions[i].answer).length}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-6">{q.q}</h3>

          <div className="space-y-3 mb-6">
            {q.options.map((opt, idx) => {
              let className =
                "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
              if (!submitted) {
                className +=
                  selected === idx
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted hover:border-primary/50 hover:bg-muted/70";
              } else {
                if (idx === q.answer) {
                  className += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300";
                } else if (idx === selected && selected !== q.answer) {
                  className += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                } else {
                  className += "border-border bg-muted opacity-60";
                }
              }

              return (
                <button key={idx} className={className} onClick={() => handleSelect(idx)}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                    {submitted && idx === q.answer && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto shrink-0" />
                    )}
                    {submitted && idx === selected && selected !== q.answer && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />
                    )}
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
              <div className="font-bold mb-1">
                {selected === q.answer ? "✅ Correct!" : "❌ Incorrect!"}
              </div>
              <div className="text-muted-foreground">{q.explanation}</div>
            </div>
          )}

          {!submitted ? (
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="w-full gradient-bg text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
            >
              {current < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
