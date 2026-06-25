import { useState } from "react";

const examples = [
  {
    word: "HELLO",
    shift: 3,
    result: "KHOOR",
    steps: [
      { letter: "H", pos: 8, shifted: 11, result: "K" },
      { letter: "E", pos: 5, shifted: 8, result: "H" },
      { letter: "L", pos: 12, shifted: 15, result: "O" },
      { letter: "L", pos: 12, shifted: 15, result: "O" },
      { letter: "O", pos: 15, shifted: 18, result: "R" },
    ],
  },
  {
    word: "MATHS",
    shift: 3,
    result: "PDWKV",
    steps: [
      { letter: "M", pos: 13, shifted: 16, result: "P" },
      { letter: "A", pos: 1, shifted: 4, result: "D" },
      { letter: "T", pos: 20, shifted: 23, result: "W" },
      { letter: "H", pos: 8, shifted: 11, result: "K" },
      { letter: "S", pos: 19, shifted: 22, result: "V" },
    ],
  },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function MathSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [highlightedPos, setHighlightedPos] = useState<number | null>(null);
  const ex = examples[activeExample];

  return (
    <section id="math" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            The Maths Behind It
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            The <span className="gradient-text">Mathematics</span> of Encryption
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Cryptography is pure maths! Let's explore how shifting letters works using numbers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-2xl font-bold mb-4">📏 Shifting Letters</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Every letter in the alphabet has a number position (A=1, B=2, …, Z=26). To encrypt a letter, we just <strong>add the shift number</strong> to its position!
            </p>
            <div className="bg-muted rounded-xl p-4 mb-4">
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">H</span>
                  <span className="text-muted-foreground">= position</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">8 + 3 (shift)</span>
                  <span className="font-bold">= 11</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Position 11</span>
                  <span className="text-green-500 font-bold">= K</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              So <strong>H → K</strong> when we use shift = 3. Simple addition!
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-2xl font-bold mb-4">🔄 Modular Arithmetic</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              What happens when a letter is near the end of the alphabet? Letter Z (position 26) with shift 3 would be position 29 — but there's no 29th letter! We use <strong>modular arithmetic</strong> (clock maths) to wrap around.
            </p>
            <div className="bg-muted rounded-xl p-4 mb-4">
              <div className="font-mono text-sm space-y-2">
                <div><span className="text-purple-500 font-bold">Z</span> = position 26</div>
                <div>26 + 3 = <span className="font-bold">29</span></div>
                <div>29 mod 26 = <span className="font-bold text-green-500">3 = C</span></div>
                <div className="text-xs text-muted-foreground pt-1">
                  (29 ÷ 26 = 1 remainder 3 → position 3 = C)
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-sm">
              <strong className="text-blue-700 dark:text-blue-300">Formula:</strong>
              <div className="font-mono mt-1 text-blue-600 dark:text-blue-400">
                new_pos = (old_pos + shift) mod 26
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
          <h3 className="text-2xl font-bold mb-2">🔠 The Alphabet Number Line</h3>
          <p className="text-sm text-muted-foreground mb-4">Hover over a letter to see its position.</p>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
              {alphabet.map((letter, i) => (
                <div
                  key={letter}
                  onMouseEnter={() => setHighlightedPos(i)}
                  onMouseLeave={() => setHighlightedPos(null)}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
                    highlightedPos === i ? "scale-125" : ""
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-colors ${
                    highlightedPos === i
                      ? "gradient-bg text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {letter}
                  </div>
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">📝 Worked Examples</h3>
            <div className="flex gap-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setActiveExample(i)}
                  className={`px-4 py-2 rounded-xl font-mono font-bold text-sm transition-all ${
                    activeExample === i
                      ? "gradient-bg text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {ex.word}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 items-center gap-6 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Original word</div>
              <div className="font-mono text-4xl font-black text-primary">{ex.word}</div>
            </div>
            <div className="text-center hidden sm:block">
              <div className="text-3xl">→</div>
              <div className="text-sm text-muted-foreground">shift = {ex.shift}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Encrypted result</div>
              <div className="font-mono text-4xl font-black text-green-600 dark:text-green-400">{ex.result}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Letter</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Position</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">+ {ex.shift}</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">mod 26</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Result</th>
                </tr>
              </thead>
              <tbody>
                {ex.steps.map((step, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 font-mono font-black text-purple-600 dark:text-purple-400 text-lg">{step.letter}</td>
                    <td className="py-2 px-3 font-mono">{step.pos}</td>
                    <td className="py-2 px-3 font-mono">{step.shifted}</td>
                    <td className="py-2 px-3 font-mono">{((step.shifted - 1) % 26) + 1}</td>
                    <td className="py-2 px-3 font-mono font-black text-green-600 dark:text-green-400 text-lg">{step.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-sm">
            <strong className="text-purple-700 dark:text-purple-300">General Formula:</strong>
            <div className="font-mono mt-1 text-purple-600 dark:text-purple-400">
              Encrypted_position = (Original_position + Key - 1) mod 26 + 1
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              (We use -1 and +1 to convert between 1-26 range and 0-25 for the mod operation)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
