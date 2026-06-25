import { useState, useRef } from "react";
import { CheckCircle, XCircle, Trophy, RotateCcw, Award, Download } from "lucide-react";
import { recordQuizScore } from "../utils/stats";
import { showToast } from "../utils/toast";

const questions = [
  { q: "What does the word 'cryptography' come from?", options: ["Latin: 'write fast'", "Greek: 'hidden writing'", "French: 'secret art'", "Arabic: 'number code'"], answer: 1, explanation: "Cryptography comes from Greek: 'kryptos' (hidden) + 'graphein' (to write)." },
  { q: "In Caesar Cipher with shift 3, what does 'A' become?", options: ["B", "C", "D", "X"], answer: 2, explanation: "A is position 1. Add shift 3 → position 4 = D. So A → D!" },
  { q: "Which concept lets letters wrap around at Z?", options: ["Multiplication", "Division", "Modular arithmetic", "Square roots"], answer: 2, explanation: "Modular arithmetic wraps Z (26) + 3 = 29, and 29 mod 26 = 3 = C. Z → C!" },
  { q: "Julius Caesar used his cipher to communicate with his…", options: ["Family", "Generals", "Business partners", "Senators"], answer: 1, explanation: "Julius Caesar used the cipher to send secret messages to his generals!" },
  { q: "If 'KHOOR' was encrypted with shift 3, what's the original?", options: ["WORLD", "HELLO", "MATHS", "CODES"], answer: 1, explanation: "K→H, H→E, O→L, O→L, R→O = HELLO!" },
  { q: "In a Number Cipher (A=1…), what is HELLO in numbers?", options: ["7 4 11 11 14", "8 5 12 12 15", "9 6 13 13 16", "1 2 3 4 5"], answer: 1, explanation: "H=8, E=5, L=12, L=12, O=15 → 8 5 12 12 15!" },
  { q: "What does SOS look like in Morse Code?", options: ["--- ... ---", "... --- ...", ".- ... -.", ". - . - ."], answer: 1, explanation: "SOS = ... (S) --- (O) ... (S). Universal distress signal!" },
  { q: "What is the Reverse Cipher of 'MATHS'?", options: ["SHTAM", "SMATH", "AMTHS", "SHMAT"], answer: 0, explanation: "Reverse cipher flips the letters. MATHS → SHTAM!" },
  { q: "Which mathematician broke the Enigma machine in WW2?", options: ["Albert Einstein", "Isaac Newton", "Alan Turing", "Carl Gauss"], answer: 2, explanation: "Alan Turing cracked Enigma, shortening WW2 and saving millions of lives!" },
  { q: "What does 'A' look like in Binary?", options: ["10000001", "01000001", "11000001", "00100001"], answer: 1, explanation: "A has ASCII code 65. In 8-bit binary: 01000001!" },
];

function generateCertificate(name: string, score: number, total: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 900; canvas.height = 630;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 900, 630);
  grad.addColorStop(0, "#0f0c29"); grad.addColorStop(0.5, "#302b63"); grad.addColorStop(1, "#24243e");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 900, 630);

  ctx.strokeStyle = "#8b5cf6"; ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 860, 590);
  ctx.strokeStyle = "rgba(139,92,246,0.3)"; ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, 840, 570);

  const stars = ["★", "✦", "◆"];
  ctx.fillStyle = "rgba(139,92,246,0.6)"; ctx.font = "20px serif";
  for (let i = 0; i < 20; i++) {
    ctx.fillText(stars[i % 3], 50 + i * 42, 580);
  }

  ctx.fillStyle = "#8b5cf6"; ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center"; ctx.letterSpacing = "4px";
  ctx.fillText("🔐  MYSTERY MESSAGING MACHINE  🔐", 450, 80);

  ctx.fillStyle = "#ffffff"; ctx.font = "bold 42px serif";
  ctx.letterSpacing = "0px";
  ctx.fillText("Certificate of Achievement", 450, 160);

  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "16px sans-serif";
  ctx.fillText("This certifies that", 450, 220);

  ctx.fillStyle = "#a78bfa"; ctx.font = "bold 52px serif";
  ctx.fillText(name || "Explorer", 450, 295);

  const underGrad = ctx.createLinearGradient(200, 310, 700, 310);
  underGrad.addColorStop(0, "transparent"); underGrad.addColorStop(0.5, "#8b5cf6"); underGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = underGrad; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(200, 310); ctx.lineTo(700, 310); ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "16px sans-serif";
  ctx.fillText("has successfully completed the", 450, 350);

  ctx.fillStyle = "#f0abfc"; ctx.font = "bold 28px sans-serif";
  ctx.fillText("Cryptography Explorer", 450, 395);

  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "16px sans-serif";
  ctx.fillText("certification with a score of", 450, 435);

  const pct = Math.round((score / total) * 100);
  ctx.fillStyle = score >= 8 ? "#4ade80" : score >= 6 ? "#facc15" : "#f87171";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(`${score}/${total}  (${pct}%)`, 450, 480);

  ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "13px sans-serif";
  ctx.fillText(`Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 450, 535);

  ctx.fillStyle = "rgba(139,92,246,0.5)"; ctx.font = "13px sans-serif";
  ctx.fillText("Built with mathematics 🧮", 450, 570);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `certificate-${(name || "explorer").replace(/\s+/g, "-")}.png`;
  a.click();
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [certName, setCertName] = useState("");

  const q = questions[current];
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleSelect = (idx: number) => { if (!submitted) setSelected(idx); };

  const handleSubmit = () => {
    if (selected === null) return;
    const newAnswers = [...answers]; newAnswers[current] = selected;
    setAnswers(newAnswers); setSubmitted(true);
    if (selected === q.answer) showToast("Correct! ✅", "success");
    else showToast("Incorrect ❌ — check the explanation below", "error");
  };

  const handleContinue = () => {
    if (current < questions.length - 1) { setCurrent(current + 1); setSelected(null); setSubmitted(false); }
    else { setShowResult(true); recordQuizScore(score); }
  };

  const restart = () => {
    setCurrent(0); setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false); setSubmitted(false);
  };

  const pct = Math.round((score / questions.length) * 100);
  const getMsg = () => {
    if (score === 10) return "Perfect score! Cryptography genius! 🏆";
    if (score >= 8)  return "Excellent! Outstanding performance! ⭐";
    if (score >= 6)  return "Good job! You know your ciphers! 👍";
    if (score >= 4)  return "Not bad! Keep studying! 📚";
    return "Keep trying! Cryptography takes practice! 💪";
  };

  if (showResult) {
    return (
      <section id="quiz" className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center animate-slide-in-up">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
          <div className="text-7xl font-black gradient-text mb-2">{score}/{questions.length}</div>
          <div className="text-muted-foreground mb-2">{pct}% correct</div>
          <p className="text-xl mb-6">{getMsg()}</p>

          <div className="w-full bg-muted rounded-full h-4 mb-6 overflow-hidden">
            <div className="h-4 rounded-full gradient-bg transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {questions.map((q, i) => (
              <div key={i} className={`rounded-xl p-3 text-center ${
                answers[i] === q.answer ? "bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700"
                                        : "bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700"
              }`}>
                <div className="text-xl mb-1">{answers[i] === q.answer ? "✅" : "❌"}</div>
                <div className="text-xs font-bold text-muted-foreground">Q{i + 1}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-purple-500" /> Download Your Certificate
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Enter your name to generate a personalised certificate of achievement!</p>
            <div className="flex gap-2">
              <input
                type="text" value={certName} onChange={(e) => setCertName(e.target.value)}
                placeholder="Your name..." maxLength={30}
                className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => {
                  if (!certName.trim()) { showToast("Please enter your name!", "error"); return; }
                  generateCertificate(certName, score, questions.length);
                  showToast("Certificate downloaded! 🎓", "success");
                }}
                className="flex items-center gap-2 gradient-bg text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all whitespace-nowrap">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
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

          <button onClick={restart} className="inline-flex items-center gap-2 gradient-bg text-white font-bold px-8 py-3 rounded-full hover:opacity-90">
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
          <span className="inline-block bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">Test Your Knowledge</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-2">Cryptography <span className="gradient-text">Quiz</span></h2>
          <p className="text-muted-foreground">10 questions · All cipher types · Certificate on completion</p>
        </div>

        <div className="flex gap-1.5 mb-6">
          {questions.map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${i < current ? "bg-green-400" : i === current ? "gradient-bg" : "bg-muted"}`} />
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
                cls += selected === idx ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted hover:border-primary/50 hover:bg-muted/70";
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
              selected === q.answer ? "bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                                   : "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700"
            }`}>
              <div className="font-bold mb-1">{selected === q.answer ? "✅ Correct!" : "❌ Incorrect!"}</div>
              <div className="text-muted-foreground">{q.explanation}</div>
            </div>
          )}

          {!submitted ? (
            <button onClick={handleSubmit} disabled={selected === null}
              className="w-full gradient-bg text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:opacity-90">Submit Answer</button>
          ) : (
            <button onClick={handleContinue} className="w-full gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90">
              {current < questions.length - 1 ? "Next Question →" : "See Results 🏆"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
