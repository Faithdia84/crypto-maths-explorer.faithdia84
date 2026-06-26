import { useState, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { caesarShift, toNumber, fromNumber, toMorse, fromMorse, toBinary, fromBinary } from "../utils/ciphers";
import { addBonusXP } from "../utils/xpSystem";
import { showToast } from "../utils/toast";

const CIPHERS = [
  { id: "caesar",  label: "Caesar Cipher",  emoji: "🔄", color: "from-purple-500 to-indigo-600" },
  { id: "number",  label: "Number Cipher",  emoji: "🔢", color: "from-blue-500 to-cyan-600" },
  { id: "morse",   label: "Morse Code",     emoji: "📡", color: "from-green-500 to-teal-600" },
  { id: "reverse", label: "Reverse Cipher", emoji: "↩️", color: "from-orange-500 to-red-500" },
  { id: "binary",  label: "Binary Code",    emoji: "💾", color: "from-pink-500 to-rose-600" },
  { id: "number",  label: "Number Cipher",  emoji: "🧮", color: "from-yellow-500 to-amber-600" },
];

const CHALLENGES: Record<string, { plain: string; hint: string }[]> = {
  caesar:  [{ plain: "HELLO",   hint: "Shift=3 → KHOOR" }, { plain: "SPY",    hint: "Shift=3 → VSB" },  { plain: "CODE",  hint: "Shift=3 → FRGH" }],
  number:  [{ plain: "HI",      hint: "H=8, I=9 → 8 9"  }, { plain: "MATH",   hint: "13 1 20 8"     },  { plain: "HERO",  hint: "8 5 18 15"     }],
  morse:   [{ plain: "SOS",     hint: "... --- ..."      }, { plain: "HELLO",  hint: ".... . .-.. .-.. ---"}, { plain: "OK",  hint: "--- -.-"          }],
  reverse: [{ plain: "CIPHER",  hint: "Backwards!"       }, { plain: "DECODE", hint: "Reverse it!"   },  { plain: "MATHS", hint: "Flip the word!" }],
  binary:  [{ plain: "HI",      hint: "72 → 01001000 …"  }, { plain: "AB",     hint: "65 66 in binary"}, { plain: "NO",   hint: "78 79 in binary" }],
};

function encrypt(id: string, plain: string): string {
  switch (id) {
    case "caesar":  return caesarShift(plain, 3);
    case "number":  return toNumber(plain);
    case "morse":   return toMorse(plain);
    case "reverse": return plain.split("").reverse().join("");
    case "binary":  return toBinary(plain);
    default:        return plain;
  }
}

export default function CipherWheel() {
  const [current, setCurrent] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const [challenge, setChallenge] = useState<{ plain: string; hint: string; encrypted: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setLanded(false);
    setChallenge(null);
    setAnswer("");
    setRevealed(false);
    setWon(false);

    let count = 0;
    const rounds = 18 + Math.floor(Math.random() * 12);
    let delay = 60;

    const tick = () => {
      setCurrent((c) => (c + 1) % CIPHERS.length);
      count++;
      if (count >= rounds) {
        setSpinning(false);
        setLanded(true);
        setCurrent((final) => {
          const cid = CIPHERS[final].id;
          const pool = CHALLENGES[cid] || CHALLENGES["caesar"];
          const ch = pool[Math.floor(Math.random() * pool.length)];
          setChallenge({ ...ch, encrypted: encrypt(cid, ch.plain) });
          return final;
        });
        return;
      }
      if (count > rounds - 6) delay = Math.min(delay + 60, 350);
      timerRef.current = setTimeout(tick, delay);
    };

    timerRef.current = setTimeout(tick, delay);
  };

  const check = () => {
    if (!challenge) return;
    if (answer.trim().toUpperCase() === challenge.plain.toUpperCase()) {
      setWon(true);
      addBonusXP(30);
      showToast("🎯 Correct! +30 XP", "success");
    } else {
      showToast("Not quite — try again!", "error");
    }
  };

  const active = CIPHERS[current];

  return (
    <section id="cipher-wheel" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🎡 Mini Game
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Cipher <span className="gradient-text">Wheel</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Spin the wheel to land on a random cipher — then decode the challenge it gives you!
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {CIPHERS.map((c, i) => (
              <div key={i}
                className={`rounded-2xl p-4 text-center transition-all duration-200 border-2 ${
                  current === i && landed
                    ? `bg-gradient-to-br ${c.color} text-white border-transparent shadow-2xl scale-110`
                    : current === i && spinning
                    ? `bg-gradient-to-br ${c.color} text-white border-transparent shadow-lg scale-105`
                    : "bg-card border-border text-muted-foreground"
                }`}>
                <div className="text-2xl mb-1">{c.emoji}</div>
                <div className="text-xs font-bold leading-tight">{c.label}</div>
              </div>
            ))}
          </div>

          <button onClick={spin} disabled={spinning}
            className={`flex items-center gap-2 font-black px-10 py-4 rounded-full text-lg transition-all ${
              spinning
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "gradient-bg text-white hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
            }`}>
            <RefreshCw className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
            {spinning ? "Spinning…" : landed ? "Spin Again" : "🎡 Spin the Wheel!"}
          </button>

          {landed && challenge && !won && (
            <div className={`w-full max-w-lg bg-gradient-to-br ${active.color} rounded-3xl p-6 text-white shadow-2xl animate-fade-in`}>
              <div className="text-sm font-bold uppercase tracking-wide opacity-80 mb-1">
                {active.emoji} {active.label} Challenge
              </div>
              <div className="font-black text-sm opacity-70 mb-3">Decode this:</div>
              <div className="bg-white/20 rounded-2xl p-4 font-mono text-xl font-black text-center mb-4 break-all">
                {challenge.encrypted}
              </div>
              {!revealed ? (
                <>
                  <div className="flex gap-2">
                    <input value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && check()}
                      placeholder="Your answer…"
                      className="flex-1 bg-white/20 placeholder-white/50 text-white rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button onClick={check} className="bg-white/20 hover:bg-white/30 font-bold px-4 py-2.5 rounded-xl transition-all text-sm">
                      Check ✓
                    </button>
                  </div>
                  <button onClick={() => setRevealed(true)} className="mt-2 text-xs text-white/60 hover:text-white/90 underline">
                    Show hint / reveal
                  </button>
                </>
              ) : (
                <div className="bg-white/20 rounded-xl p-3 text-sm">
                  <div className="font-bold mb-1">💡 Hint: {challenge.hint}</div>
                  <div className="opacity-80">Answer: <strong>{challenge.plain}</strong></div>
                </div>
              )}
            </div>
          )}

          {won && (
            <div className="w-full max-w-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white text-center shadow-2xl animate-fade-in">
              <div className="text-5xl mb-3">🎉</div>
              <div className="text-2xl font-black mb-1">Correct!</div>
              <div className="text-white/80 text-sm mb-4">You decoded the {active.label}! +30 XP earned.</div>
              <button onClick={spin} className="bg-white/20 hover:bg-white/30 font-bold px-6 py-2.5 rounded-xl transition-all">
                🎡 Spin Again
              </button>
            </div>
          )}

          {!landed && !spinning && (
            <div className="text-muted-foreground text-sm text-center">
              Spin the wheel and a random cipher challenge will appear for you to decode!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
