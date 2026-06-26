import { useState } from "react";
import { Calendar, Eye, RotateCcw } from "lucide-react";
import { caesarShift, toNumber, toMorse, toBinary } from "../utils/ciphers";
import { addBonusXP } from "../utils/xpSystem";
import { showToast } from "../utils/toast";

interface DailyEntry {
  plain: string;
  cipher: "caesar" | "number" | "morse" | "reverse" | "binary";
  key?: number;
  fact: string;
}

const DAILY_POOL: DailyEntry[] = [
  { plain: "KEEP IT SECRET",   cipher: "caesar",  key: 3,  fact: "Caesar Cipher was used by Julius Caesar 2000 years ago to send war messages!" },
  { plain: "HELLO WORLD",      cipher: "number",          fact: "The Number Cipher assigns each letter its position in the alphabet (A=1, B=2 ...)." },
  { plain: "SOS",              cipher: "morse",           fact: "Morse Code was invented in 1836 and was used to communicate across telegraph lines!" },
  { plain: "MATHS IS FUN",     cipher: "reverse",         fact: "Reverse cipher is the simplest transposition — you just flip the order of letters!" },
  { plain: "SPY AGENT",        cipher: "caesar",  key: 7,  fact: "Caesar Cipher with shift 7 means A becomes H, and Z becomes G." },
  { plain: "DECODE ME",        cipher: "number",          fact: "Number ciphers are simple substitution ciphers where symbols replace letters." },
  { plain: "TOP SECRET",       cipher: "morse",           fact: "During World War II, Morse Code was used to send thousands of secret messages!" },
  { plain: "CIPHER MASTER",    cipher: "reverse",         fact: "Palindromes like RACECAR look the same forwards and backwards — a perfect reverse cipher!" },
  { plain: "BINARY CODE",      cipher: "binary",          fact: "Every letter in your computer is stored as binary — 1s and 0s!" },
  { plain: "CRYPTOGRAPHY",     cipher: "caesar",  key: 5,  fact: "Cryptography comes from the Greek words 'kryptos' (hidden) and 'graphia' (writing)." },
  { plain: "MATHEMATICS",      cipher: "number",          fact: "All modern encryption uses mathematics — from simple shifts to complex algorithms!" },
  { plain: "SECRET AGENT",     cipher: "reverse",         fact: "Spies throughout history have used hundreds of different encryption techniques!" },
  { plain: "ZERO ONE",         cipher: "binary",          fact: "Binary code uses only 0 and 1 — the two digits that computers understand!" },
  { plain: "LOCK AND KEY",     cipher: "caesar",  key: 13, fact: "ROT13 (shift 13) is its own inverse — applying it twice gives back the original!" },
  { plain: "PUZZLE SOLVED",    cipher: "morse",           fact: "The first transatlantic telegraph message was sent in Morse Code in 1858!" },
  { plain: "FIVE FOUR THREE",  cipher: "number",          fact: "Number ciphers are easy to crack by frequency analysis of letter positions!" },
  { plain: "HIDDEN MESSAGE",   cipher: "reverse",         fact: "Steganography hides messages in plain sight — like hidden text in images!" },
  { plain: "CLASS SEVEN",      cipher: "caesar",  key: 4,  fact: "Class 7 is the perfect time to learn cryptography — you know enough maths!" },
  { plain: "DATA IS SAFE",     cipher: "binary",          fact: "Modern websites use 256-bit encryption — that is 2^256 possible combinations!" },
  { plain: "GRAND MASTER",     cipher: "caesar",  key: 6,  fact: "Alan Turing cracked the German Enigma code in WWII, shortening the war by 2 years!" },
  { plain: "EYES ONLY",        cipher: "morse",           fact: "Morse Code has unique dot-dash sequences for every letter of the alphabet!" },
  { plain: "MISSION COMPLETE", cipher: "reverse",         fact: "The Caesar Cipher is a type of monoalphabetic substitution cipher." },
  { plain: "NUMBER ONE SPY",   cipher: "number",          fact: "Frequency analysis is the study of how often letters appear in a language." },
  { plain: "CODE BREAKER",     cipher: "binary",          fact: "HTML, images, and videos on the internet are all stored as binary data!" },
  { plain: "FIND THE ANSWER",  cipher: "caesar",  key: 9,  fact: "Modern encryption uses prime numbers — maths that is almost impossible to reverse!" },
  { plain: "ENCRYPT DECRYPT",  cipher: "number",          fact: "Encryption converts plain text into ciphertext. Decryption reverses it!" },
  { plain: "SPY MISSION",      cipher: "reverse",         fact: "During the Cold War, 'one-time pad' encryption was considered unbreakable!" },
  { plain: "ALPHA BRAVO",      cipher: "morse",           fact: "The NATO phonetic alphabet (Alpha, Bravo…) is also used alongside Morse Code!" },
  { plain: "SECRET CODE",      cipher: "binary",          fact: "The letter A is 65 in decimal and 01000001 in binary — try it on a calculator!" },
  { plain: "WELL DONE",        cipher: "caesar",  key: 11, fact: "XOR encryption is used in many modern ciphers — it combines bits with a key!" },
];

function getEncrypted(entry: DailyEntry): string {
  switch (entry.cipher) {
    case "caesar":  return caesarShift(entry.plain, entry.key ?? 3);
    case "number":  return toNumber(entry.plain);
    case "morse":   return toMorse(entry.plain);
    case "reverse": return entry.plain.split("").reverse().join("");
    case "binary":  return toBinary(entry.plain);
  }
}

const CIPHER_LABELS: Record<string, string> = {
  caesar: "Caesar Cipher",
  number: "Number Cipher",
  morse: "Morse Code",
  reverse: "Reverse Cipher",
  binary: "Binary Code",
};

const CIPHER_COLORS: Record<string, string> = {
  caesar:  "from-purple-500 to-indigo-600",
  number:  "from-blue-500 to-cyan-600",
  morse:   "from-green-500 to-teal-600",
  reverse: "from-orange-500 to-red-500",
  binary:  "from-pink-500 to-rose-600",
};

export default function DailySecretMessage() {
  const dayIndex = Math.floor(Date.now() / 86_400_000) % DAILY_POOL.length;
  const entry    = DAILY_POOL[dayIndex];
  const encrypted = getEncrypted(entry);
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const check = () => {
    if (answer.trim().toUpperCase().replace(/\s+/g, " ") === entry.plain.trim().toUpperCase()) {
      setSolved(true);
      addBonusXP(100);
      showToast("🌟 Daily message decoded! +100 XP", "success");
    } else {
      showToast("Not quite — keep trying!", "error");
    }
  };

  const color = CIPHER_COLORS[entry.cipher];

  return (
    <section id="daily-message" className="py-20 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            📅 Daily Feature
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Daily Secret <span className="gradient-text">Message</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A brand new encrypted message appears every day. Decode it and earn bonus XP!
          </p>
        </div>

        <div className={`bg-gradient-to-br ${color} rounded-3xl p-7 text-white shadow-2xl`}>
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 opacity-80" />
            <span className="text-sm font-bold opacity-80">{today}</span>
            <span className="ml-auto bg-white/20 text-xs font-bold px-3 py-1 rounded-full">
              {CIPHER_LABELS[entry.cipher]}
              {entry.cipher === "caesar" && entry.key ? ` (shift ${entry.key})` : ""}
            </span>
          </div>

          <div className="mb-2 text-sm font-bold opacity-70 uppercase tracking-wide">Today's Encrypted Message:</div>
          <div className="bg-white/15 rounded-2xl p-5 font-mono text-xl sm:text-2xl font-black text-center mb-5 break-all tracking-widest">
            {encrypted}
          </div>

          {!solved && !revealed && (
            <div className="flex gap-2">
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && check()}
                placeholder="Type the decoded message…"
                className="flex-1 bg-white/20 placeholder-white/50 text-white rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button onClick={check}
                className="bg-white/20 hover:bg-white/30 font-black px-5 py-3 rounded-xl transition-all text-sm shrink-0">
                Check ✓
              </button>
            </div>
          )}

          {!solved && !revealed && (
            <button onClick={() => setRevealed(true)} className="mt-3 text-xs text-white/60 hover:text-white/90 underline flex items-center gap-1">
              <Eye className="w-3 h-3" /> Reveal answer
            </button>
          )}

          {revealed && !solved && (
            <div className="bg-white/20 rounded-2xl p-4 mt-3">
              <div className="font-black text-lg mb-1">The message was: <span className="underline">{entry.plain}</span></div>
              <div className="text-sm opacity-80">💡 {entry.fact}</div>
            </div>
          )}

          {solved && (
            <div className="bg-white/20 rounded-2xl p-4 mt-3 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="font-black text-lg mb-1">Brilliant! You decoded it!</div>
              <div className="text-sm opacity-80 mb-2">Answer: <strong>{entry.plain}</strong></div>
              <div className="text-sm opacity-80 italic">💡 {entry.fact}</div>
              <div className="mt-2 bg-white/20 rounded-xl px-4 py-2 inline-block font-bold text-sm">+100 XP earned ⭐</div>
            </div>
          )}
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3 text-center text-sm text-muted-foreground">
          <div className="bg-card border border-border rounded-2xl p-3">
            <div className="text-2xl mb-1">📅</div>
            <div className="font-semibold text-foreground">New message daily</div>
            <div className="text-xs">Changes at midnight</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3">
            <div className="text-2xl mb-1">🔄</div>
            <div className="font-semibold text-foreground">6 cipher types</div>
            <div className="text-xs">Always different</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-semibold text-foreground">+100 XP</div>
            <div className="text-xs">For correct decode</div>
          </div>
        </div>
      </div>
    </section>
  );
}
