import { useState } from "react";

const examples = [
  {
    word: "HELLO", shift: 3, result: "KHOOR",
    steps: [
      { letter: "H", pos: 8,  shifted: 11, result: "K" },
      { letter: "E", pos: 5,  shifted: 8,  result: "H" },
      { letter: "L", pos: 12, shifted: 15, result: "O" },
      { letter: "L", pos: 12, shifted: 15, result: "O" },
      { letter: "O", pos: 15, shifted: 18, result: "R" },
    ],
  },
  {
    word: "MATHS", shift: 3, result: "PDWKV",
    steps: [
      { letter: "M", pos: 13, shifted: 16, result: "P" },
      { letter: "A", pos: 1,  shifted: 4,  result: "D" },
      { letter: "T", pos: 20, shifted: 23, result: "W" },
      { letter: "H", pos: 8,  shifted: 11, result: "K" },
      { letter: "S", pos: 19, shifted: 22, result: "V" },
    ],
  },
];

const concepts = [
  {
    icon: "📏",
    title: "Patterns & Sequences",
    color: "border-l-4 border-purple-500",
    content: "The alphabet is a pattern: A B C D E … Z. Cryptography uses these patterns — shifting by a fixed number creates a predictable new pattern. Finding patterns is a key skill in breaking codes!",
    example: "Shift 3: A→D, B→E, C→F … X→A, Y→B, Z→C",
  },
  {
    icon: "🔢",
    title: "Number Systems",
    color: "border-l-4 border-blue-500",
    content: "Every letter has a number. A=1, B=2 … Z=26. In binary, A=01000001 (65 in decimal). Numbers and letters are just two ways of writing the same thing — this is the core of cryptography!",
    example: "HELLO = 8, 5, 12, 12, 15  |  H = 01001000 (binary)",
  },
  {
    icon: "➕",
    title: "Letter Shifting",
    color: "border-l-4 border-cyan-500",
    content: "Shifting is just addition! To encrypt H (position 8) with shift 3, we add 3 to get 11, which is K. To decrypt, we subtract 3. Encryption is addition, decryption is subtraction!",
    example: "Encrypt: pos + shift  |  Decrypt: pos − shift",
  },
  {
    icon: "🔄",
    title: "Modular Arithmetic",
    color: "border-l-4 border-green-500",
    content: "What happens when position + shift > 26? We use mod (remainder after division) to wrap around! Think of a clock: after 12 comes 1, not 13. The alphabet wraps the same way!",
    example: "Z (26) + 3 = 29.  29 mod 26 = 3 = C.  So Z → C",
  },
  {
    icon: "🧩",
    title: "Codes & Symbols",
    color: "border-l-4 border-orange-500",
    content: "Any symbol can represent a letter if sender and receiver agree on the rule. Morse code uses dots and dashes. Binary uses 0s and 1s. Mathematics defines the mapping — the 'code book'.",
    example: "S = ...   O = ---   H = ....   (Morse Code)",
  },
  {
    icon: "🧮",
    title: "Mathematical Logic",
    color: "border-l-4 border-pink-500",
    content: "Cryptography uses logical rules: 'if letter is A, output is X'. Boolean logic (AND, OR, NOT) is used in modern encryption. A formula that only has one correct answer can be used as a lock!",
    example: "RSA key: e × d ≡ 1 (mod φ(n))  — a mathematical 'lock'",
  },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function MathSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [hoveredPos, setHoveredPos] = useState<number | null>(null);
  const [customShift, setCustomShift] = useState(3);
  const ex = examples[activeExample];

  const shiftedAlphabet = alphabet.map((_, i) => alphabet[(i + customShift) % 26]);

  return (
    <section id="math" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            The Maths Behind It
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Mathematics of <span className="gradient-text">Encryption</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Cryptography is pure mathematics! Here's how the numbers and operations work together.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {concepts.map((c, i) => (
            <div key={i} className={`bg-card rounded-2xl p-6 border border-border shadow-sm ${c.color} card-hover`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-lg mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{c.content}</p>
              <div className="bg-muted rounded-xl px-3 py-2 font-mono text-xs text-muted-foreground">
                {c.example}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
          <h3 className="text-2xl font-bold mb-2">🔠 Interactive Alphabet Number Line</h3>
          <p className="text-sm text-muted-foreground mb-4">Hover over any letter to see its position. Change the shift to see how the cipher alphabet changes!</p>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-semibold shrink-0">Shift = <span className="text-primary font-black">{customShift}</span></label>
            <input type="range" min={1} max={25} value={customShift}
              onChange={(e) => setCustomShift(Number(e.target.value))} className="flex-1 accent-purple-500" />
          </div>

          <div className="overflow-x-auto pb-2 space-y-2">
            <div className="flex gap-1 min-w-max">
              {alphabet.map((letter, i) => (
                <div key={letter} onMouseEnter={() => setHoveredPos(i)} onMouseLeave={() => setHoveredPos(null)}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${hoveredPos === i ? "scale-125" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                    hoveredPos === i ? "gradient-bg text-white" : "bg-muted text-muted-foreground"
                  }`}>{letter}</div>
                  <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1 min-w-max">
              {shiftedAlphabet.map((letter, i) => (
                <div key={i} className={`flex flex-col items-center gap-0.5 transition-all ${hoveredPos === i ? "scale-125" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                    hoveredPos === i ? "bg-green-500 text-white" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  }`}>{letter}</div>
                  <span className="text-[10px] text-muted-foreground">↑</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="inline-block w-8 text-center bg-muted rounded px-1">A–Z</span> = plain alphabet &nbsp;|&nbsp;
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-1">A–Z</span> = cipher alphabet (shift {customShift})
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold">📝 Worked Examples (shift = 3)</h3>
            <div className="flex gap-2">
              {examples.map((ex, i) => (
                <button key={i} onClick={() => setActiveExample(i)}
                  className={`px-4 py-2 rounded-xl font-mono font-bold text-sm transition-all ${
                    activeExample === i ? "gradient-bg text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}>
                  {ex.word}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-center mb-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Original</div>
              <div className="font-mono text-4xl font-black text-primary">{ex.word}</div>
            </div>
            <div className="text-3xl text-muted-foreground">→</div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Encrypted</div>
              <div className="font-mono text-4xl font-black text-green-600 dark:text-green-400">{ex.result}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Letter</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Position</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">+ Shift (3)</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">mod 26</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Result Letter</th>
                </tr>
              </thead>
              <tbody>
                {ex.steps.map((step, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 font-mono font-black text-purple-600 dark:text-purple-400 text-xl">{step.letter}</td>
                    <td className="py-2 px-3 font-mono">{step.pos}</td>
                    <td className="py-2 px-3 font-mono">{step.shifted}</td>
                    <td className="py-2 px-3 font-mono">{((step.shifted - 1) % 26) + 1}</td>
                    <td className="py-2 px-3 font-mono font-black text-green-600 dark:text-green-400 text-xl">{step.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-sm">
              <strong className="text-purple-700 dark:text-purple-300">Encryption Formula:</strong>
              <div className="font-mono mt-1 text-purple-600 dark:text-purple-400">
                E(x) = (x + k − 1) mod 26 + 1
              </div>
              <div className="text-xs text-muted-foreground mt-1">x = letter position, k = key (shift)</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm">
              <strong className="text-blue-700 dark:text-blue-300">Decryption Formula:</strong>
              <div className="font-mono mt-1 text-blue-600 dark:text-blue-400">
                D(x) = (x − k − 1 + 26) mod 26 + 1
              </div>
              <div className="text-xs text-muted-foreground mt-1">Always add 26 before mod to avoid negatives</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              title: "🕐 Modular Arithmetic = Clock Maths",
              color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
              content: "Just like a clock goes 1→12 then back to 1, the alphabet wraps around. After Z (26) comes A (1) again. This is why we use mod 26!",
            },
            {
              title: "🔑 Key Space",
              color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
              content: "Caesar Cipher only has 25 possible keys (shifts 1–25). That's why it's easy to break! Modern encryption uses keys with 2^256 possibilities — impossible to guess by trial!",
            },
            {
              title: "📊 Frequency Analysis",
              color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
              content: "In English, E is the most common letter. So in a Caesar-encrypted text, the most common letter is probably the encryption of E. This is how you crack codes without knowing the key!",
            },
          ].map((card, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${card.color}`}>
              <h4 className="font-bold mb-3">{card.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
