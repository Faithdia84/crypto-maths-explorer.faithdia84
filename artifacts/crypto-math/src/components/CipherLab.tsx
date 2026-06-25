import { useState, useRef, useCallback, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Copy, Check, Trash2, Download, ArrowRight, RotateCcw,
  Lock, Hash, Radio, FlipHorizontal, Sparkles, Binary
} from "lucide-react";

type CipherType = "caesar" | "number" | "morse" | "reverse" | "symbol" | "binary";

const MORSE: Record<string, string> = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....",
  I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.",
  Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-",
  Y:"-.--", Z:"--..", "0":"-----", "1":".----", "2":"..---", "3":"...--",
  "4":"....-", "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----.",
  " ":"/"
};
const MORSE_REV: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

const SYMBOL_MAP: Record<string, string> = {
  A:"@", B:"#", C:"$", D:"%", E:"&", F:"*", G:"!", H:"?", I:"^", J:"~",
  K:"+", L:"-", M:"=", N:"|", O:"<", P:">", Q:"/", R:"\\", S:";", T:":",
  U:"[", V:"]", W:"{", X:"}", Y:"(", Z:")"
};
const SYMBOL_REV: Record<string, string> = Object.fromEntries(
  Object.entries(SYMBOL_MAP).map(([k, v]) => [v, k])
);

function caesarShift(text: string, shift: number): string {
  return text.split("").map((char) => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
    }
    return char;
  }).join("");
}

function toNumber(text: string): string {
  return text.toUpperCase().split("").map((c) => {
    if (/[A-Z]/.test(c)) return String(c.charCodeAt(0) - 64);
    if (c === " ") return "0";
    return c;
  }).join(" ");
}

function fromNumber(text: string): string {
  return text.trim().split(/\s+/).map((n) => {
    const num = parseInt(n);
    if (num >= 1 && num <= 26) return String.fromCharCode(num + 64);
    if (num === 0) return " ";
    return n;
  }).join("");
}

function toMorse(text: string): string {
  return text.toUpperCase().split("").map((c) => MORSE[c] || c).join(" ");
}

function fromMorse(text: string): string {
  return text.trim().split(/\s+/).map((code) => MORSE_REV[code] || code).join("");
}

function toSymbol(text: string): string {
  return text.toUpperCase().split("").map((c) => SYMBOL_MAP[c] || c).join(" ");
}

function fromSymbol(text: string): string {
  return text.trim().split(/\s+/).map((s) => SYMBOL_REV[s] || s).join("");
}

function toBinary(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

function fromBinary(text: string): string {
  return text.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

function getCaesarSteps(input: string, shift: number) {
  return input.split("").filter((c) => /[a-zA-Z]/.test(c)).map((char) => {
    const base = char >= "a" ? 97 : 65;
    const shifted = String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
    return { from: char.toUpperCase(), to: shifted.toUpperCase() };
  });
}

const TABS: { id: CipherType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "caesar",  label: "Caesar",   icon: <Lock className="w-4 h-4" />,           color: "from-purple-500 to-indigo-600" },
  { id: "number",  label: "Number",   icon: <Hash className="w-4 h-4" />,            color: "from-blue-500 to-cyan-600" },
  { id: "morse",   label: "Morse",    icon: <Radio className="w-4 h-4" />,           color: "from-green-500 to-teal-600" },
  { id: "reverse", label: "Reverse",  icon: <FlipHorizontal className="w-4 h-4" />, color: "from-orange-500 to-red-600" },
  { id: "symbol",  label: "Symbol",   icon: <Sparkles className="w-4 h-4" />,        color: "from-pink-500 to-rose-600" },
  { id: "binary",  label: "Binary",   icon: <Binary className="w-4 h-4" />,          color: "from-gray-600 to-slate-700" },
];

interface HistoryEntry { id: number; cipher: string; input: string; output: string; time: string; }

export default function CipherLab() {
  const [tab, setTab] = useState<CipherType>("caesar");
  const [input, setInput] = useState("HELLO");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [output, setOutput] = useState("");
  const [steps, setSteps] = useState<{ from: string; to: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const nextId = useRef(1);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const compute = useCallback(() => {
    const text = input;
    if (!text.trim()) { setOutput(""); setSteps([]); return; }
    let result = "";
    const actualShift = mode === "encrypt" ? shift : 26 - shift;

    switch (tab) {
      case "caesar":
        result = caesarShift(text, actualShift);
        setSteps(getCaesarSteps(text, actualShift));
        break;
      case "number":
        result = mode === "encrypt" ? toNumber(text) : fromNumber(text);
        setSteps([]);
        break;
      case "morse":
        result = mode === "encrypt" ? toMorse(text) : fromMorse(text);
        setSteps([]);
        break;
      case "reverse":
        result = text.split("").reverse().join("");
        setSteps([]);
        break;
      case "symbol":
        result = mode === "encrypt" ? toSymbol(text) : fromSymbol(text);
        setSteps([]);
        break;
      case "binary":
        result = mode === "encrypt" ? toBinary(text) : fromBinary(text);
        setSteps([]);
        break;
    }
    setOutput(result);
  }, [input, shift, mode, tab]);

  useEffect(() => { compute(); }, [compute]);

  const saveToHistory = () => {
    if (!output) return;
    const label = TABS.find((t) => t.id === tab)?.label ?? tab;
    setHistory((h) => [{
      id: nextId.current++, cipher: label, input, output,
      time: new Date().toLocaleTimeString()
    }, ...h].slice(0, 8));
  };

  const downloadText = () => {
    const blob = new Blob([`Input:\n${input}\n\nOutput:\n${output}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${tab}-cipher.txt`; a.click();
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const a = document.createElement("a");
    a.href = qrRef.current.toDataURL("image/png");
    a.download = "qrcode.png"; a.click();
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeTab = TABS.find((t) => t.id === tab)!;
  const stepColors = [
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  ];

  return (
    <section id="cipher-lab" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Interactive Tools
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Cipher <span className="gradient-text">Lab</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            6 different encryption methods — encrypt, decrypt, and explore!
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setOutput(""); setSteps([]); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === t.id
                  ? `bg-gradient-to-r ${t.color} text-white shadow-md scale-105`
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className={`h-1 rounded-full bg-gradient-to-r ${activeTab.color} mb-8 transition-all`} />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              {activeTab.icon}
              <span>{activeTab.label} Cipher</span>
              {tab === "caesar" && (
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  Julius Caesar used shift = 3
                </span>
              )}
            </h3>

            {tab !== "reverse" && (
              <div className="flex gap-2 mb-4">
                {(["encrypt", "decrypt"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                      mode === m
                        ? `bg-gradient-to-r ${activeTab.color} text-white shadow-md`
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {m === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}
                  </button>
                ))}
              </div>
            )}

            {tab === "caesar" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Shift Key: <span className="text-primary font-black text-lg">{shift}</span>
                </label>
                <input
                  type="range" min={1} max={25} value={shift}
                  onChange={(e) => setShift(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span><span>25</span>
                </div>
              </div>
            )}

            {tab === "symbol" && (
              <div className="mb-4 bg-muted rounded-xl p-3">
                <div className="text-xs font-bold text-muted-foreground mb-2">Symbol Table:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(SYMBOL_MAP).slice(0, 13).map(([k, v]) => (
                    <span key={k} className="text-xs font-mono bg-card border border-border px-1.5 py-0.5 rounded">
                      {k}={v}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground">…and more</span>
                </div>
              </div>
            )}

            {tab === "morse" && (
              <div className="mb-4 bg-muted rounded-xl p-3 text-xs">
                <div className="font-bold text-muted-foreground mb-1">Examples:</div>
                <div className="font-mono space-y-0.5 text-muted-foreground">
                  <div>A = .-   B = -...   C = -.-.</div>
                  <div>S = ...   O = ---   SOS = ... --- ...</div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                {mode === "encrypt" || tab === "reverse" ? "Message to encode:" : "Encoded text to decode:"}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
                rows={4}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveToHistory}
                className={`flex-1 bg-gradient-to-r ${activeTab.color} text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95`}
              >
                {tab === "reverse" ? "↔️ Reverse!" : mode === "encrypt" ? "🔒 Encrypt!" : "🔓 Decrypt!"}
              </button>
              <button onClick={() => { setInput(""); setOutput(""); setSteps([]); }}
                className="px-3 bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-colors" title="Clear">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">
                  {tab === "reverse" ? "↔️ Reversed" : mode === "encrypt" ? "🔒 Encrypted" : "🔓 Decrypted"} Output
                </h3>
                <div className="flex gap-2">
                  <button onClick={copyOutput}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copied ? "bg-green-100 text-green-700 dark:bg-green-900/40" : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}>
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={downloadText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/70 transition-all"
                    title="Download as text">
                    <Download className="w-3 h-3" /> .txt
                  </button>
                </div>
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 font-mono text-sm min-h-[80px] break-all">
                {output || <span className="text-muted-foreground text-sm">Output will appear here...</span>}
              </div>

              {tab === "number" && mode === "encrypt" && (
                <div className="mt-2 text-xs text-muted-foreground">
                  A=1, B=2, C=3 … Z=26, Space=0
                </div>
              )}
              {tab === "binary" && mode === "encrypt" && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Each letter = 8-bit ASCII binary
                </div>
              )}
            </div>

            {output && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">📱 QR Code</h3>
                  <button onClick={downloadQR}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/70 transition-all">
                    <Download className="w-3 h-3" /> PNG
                  </button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeCanvas ref={qrRef} value={output.slice(0, 500) || " "} size={130} />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan to read the {mode === "encrypt" ? "encrypted" : "decoded"} message
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {steps.length > 0 && tab === "caesar" && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6 animate-fade-in">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              📋 Step-by-Step Letter Changes
              <span className="text-muted-foreground text-sm font-normal">
                (shift = {mode === "encrypt" ? shift : 26 - shift})
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {steps.map((step, i) => (
                <div key={i}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-mono font-bold animate-fade-in ${stepColors[i % stepColors.length]}`}
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  <span>{step.from}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{step.to}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">📜 Encryption History</h3>
              <button onClick={() => setHistory([])}
                className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1">
                <RotateCcw className="w-4 h-4" /> Clear
              </button>
            </div>
            <div className="space-y-2">
              {history.map((entry) => (
                <div key={entry.id} className="bg-muted rounded-xl p-3 text-sm flex items-center gap-3 animate-slide-in-up">
                  <span className="bg-card border border-border px-2 py-0.5 rounded-lg text-xs font-bold text-primary shrink-0">
                    {entry.cipher}
                  </span>
                  <span className="font-mono truncate max-w-[30%]">{entry.input}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="font-mono truncate max-w-[30%] text-primary font-bold">{entry.output}</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
