import { useState } from "react";
import { Copy, Check, Download, Trash2, Zap } from "lucide-react";
import { caesarShift, toNumber, toMorse, toSymbol, toBinary } from "../utils/ciphers";
import { recordComparison } from "../utils/stats";
import { showToast } from "../utils/toast";

interface CipherResult { label: string; output: string; emoji: string; color: string; desc: string; }

function runAllCiphers(text: string): CipherResult[] {
  if (!text.trim()) return [];
  return [
    { label: "Caesar Cipher",   emoji: "🔐", color: "from-purple-500 to-indigo-600",  desc: "Shift each letter by 3",        output: caesarShift(text, 3) },
    { label: "Number Cipher",   emoji: "🔢", color: "from-blue-500 to-cyan-600",      desc: "A=1, B=2 … Z=26",              output: toNumber(text) },
    { label: "Morse Code",      emoji: "📡", color: "from-green-500 to-teal-600",     desc: "Dots and dashes",              output: toMorse(text) },
    { label: "Reverse Cipher",  emoji: "↔️",  color: "from-orange-500 to-amber-600",  desc: "Letters in reverse order",    output: text.split("").reverse().join("") },
    { label: "Symbol Cipher",   emoji: "✨", color: "from-pink-500 to-rose-600",      desc: "Custom symbol substitution",   output: toSymbol(text) },
    { label: "Binary Code",     emoji: "💻", color: "from-slate-600 to-gray-700",     desc: "8-bit binary (ASCII)",         output: toBinary(text) },
  ];
}

export default function CipherComparison() {
  const [input, setInput] = useState("HELLO");
  const [results, setResults] = useState<CipherResult[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [ran, setRan] = useState(false);

  const compare = () => {
    if (!input.trim()) { showToast("Please enter a message first!", "error"); return; }
    const res = runAllCiphers(input);
    setResults(res);
    setRan(true);
    recordComparison();
    showToast("All 6 ciphers applied!", "success");
  };

  const copyOne = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    showToast(`Copied ${label} result!`, "success");
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAll = () => {
    if (!results.length) return;
    const content = results.map((r) => `${r.label}:\n${r.output}`).join("\n\n");
    const blob = new Blob([`Input: ${input}\n\n${content}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "cipher-comparison.txt"; a.click();
    showToast("Downloaded all results!", "success");
  };

  const clear = () => { setInput(""); setResults([]); setRan(false); };

  return (
    <section id="comparison" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            All At Once
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Cipher <span className="gradient-text">Comparison</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter one message and instantly see it encrypted by all 6 cipher methods side-by-side!
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && compare()}
              placeholder="Type your message (e.g. HELLO WORLD)..."
              className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />
            <div className="flex gap-2">
              <button onClick={compare}
                className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                <Zap className="w-4 h-4" /> Compare All
              </button>
              {ran && (
                <button onClick={downloadAll}
                  className="flex items-center gap-2 bg-muted text-foreground font-bold px-4 py-3 rounded-xl hover:bg-muted/70 transition-all"
                  title="Download all results">
                  <Download className="w-4 h-4" />
                </button>
              )}
              {ran && (
                <button onClick={clear}
                  className="flex items-center gap-2 bg-muted text-muted-foreground hover:text-destructive font-bold px-4 py-3 rounded-xl hover:bg-muted/70 transition-all"
                  title="Clear">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {results.map((r) => (
              <div key={r.label} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden card-hover animate-slide-in-up">
                <div className={`bg-gradient-to-r ${r.color} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <span>{r.emoji}</span> {r.label}
                  </div>
                  <button onClick={() => copyOne(r.label, r.output)}
                    className="text-white/80 hover:text-white transition-colors">
                    {copied === r.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground mb-2">{r.desc}</div>
                  <div className="bg-muted rounded-xl px-3 py-2 font-mono text-sm break-all min-h-[48px]">
                    {r.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!ran && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-lg font-medium">Enter a message above and click "Compare All"</div>
            <div className="text-sm">All 6 cipher results will appear here side by side</div>
          </div>
        )}
      </div>
    </section>
  );
}
