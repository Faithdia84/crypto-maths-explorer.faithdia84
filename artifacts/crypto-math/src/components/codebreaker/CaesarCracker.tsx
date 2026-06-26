import { useState } from "react";
import { Search, Copy, Check } from "lucide-react";
import { caesarShift } from "../../utils/ciphers";
import { COMMON_WORDS } from "../../utils/cbData";
import { showToast } from "../../utils/toast";

function scoreReadability(text: string): number {
  const words = text.toUpperCase().split(/\s+/);
  return words.filter((w) => COMMON_WORDS.has(w)).length;
}

export default function CaesarCracker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ key: number; text: string; score: number }[]>([]);
  const [cracked, setCracked] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const crack = () => {
    if (!input.trim()) { showToast("Enter an encrypted message first!", "error"); return; }
    const res = Array.from({ length: 25 }, (_, i) => {
      const key = i + 1;
      const text = caesarShift(input.trim().toUpperCase(), -key);
      return { key, text, score: scoreReadability(text) };
    });
    res.sort((a, b) => b.score - a.score || a.key - b.key);
    setResults(res);
    setCracked(true);
    showToast("All 25 keys tried! Likely results shown first.", "success");
  };

  const copy = (key: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    showToast("Copied!", "success");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 mb-6 text-white">
        <h3 className="text-xl font-black mb-1">🔍 Crack Any Caesar Cipher</h3>
        <p className="text-white/80 text-sm">Paste any Caesar-encrypted message. We'll try all 25 possible keys and highlight the most readable result.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && crack()}
          placeholder="Paste encrypted message here (e.g. KHOOR ZRUOG)..."
          className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
        />
        <button onClick={crack}
          className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
          <Search className="w-4 h-4" /> Crack It!
        </button>
      </div>

      {cracked && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-foreground">Results — sorted by most likely English</span>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded-full">
              ✅ Best match at top
            </span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {results.map(({ key, text, score }) => (
              <div
                key={key}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                  score > 0
                    ? "bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-700"
                    : "bg-card border-border"
                }`}
              >
                <div className={`shrink-0 text-xs font-black w-14 text-center py-1 rounded-lg ${
                  score > 0 ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  Key {key}
                </div>
                <div className="flex-1 font-mono text-sm break-all">{text}</div>
                {score > 0 && (
                  <div className="shrink-0 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {score} match{score !== 1 ? "es" : ""}
                  </div>
                )}
                <button onClick={() => copy(key, text)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  {copied === key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <div className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-2">📚 How Caesar Cracking Works</div>
            <p className="text-sm text-foreground">
              A Caesar Cipher only has 25 possible keys (shift 1–25). We try every single one and check which result contains real English words. 
              This is called a <strong>brute force attack</strong> — when the key space is small, brute force is easy!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              🔢 Maths: Decrypt(x, k) = (x − k + 26) mod 26, tried for k = 1, 2, 3 … 25.
            </p>
          </div>
        </div>
      )}

      {!cracked && (
        <div className="text-center py-10 text-muted-foreground">
          <div className="text-5xl mb-3">🔐</div>
          <div className="font-medium">Paste a Caesar-encrypted message and click "Crack It!"</div>
          <div className="text-sm mt-1">We'll try all 25 possible shift keys for you</div>
          <div className="mt-4 text-xs bg-muted rounded-xl px-4 py-2 inline-block font-mono">Try: KHOOR ZRUOG</div>
        </div>
      )}
    </div>
  );
}
