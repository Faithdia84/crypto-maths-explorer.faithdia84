import { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Trash2, ArrowRight, RotateCcw, Download } from "lucide-react";

interface HistoryEntry {
  id: number;
  input: string;
  output: string;
  key: number;
  mode: "encrypt" | "decrypt";
  time: string;
}

function caesarShift(text: string, shift: number): string {
  return text
    .split("")
    .map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        const base = char >= "a" ? 97 : 65;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
      }
      return char;
    })
    .join("");
}

function getSteps(input: string, shift: number): { from: string; to: string }[] {
  return input
    .split("")
    .filter((c) => /[a-zA-Z]/.test(c))
    .map((char) => {
      const base = char >= "a" ? 97 : 65;
      const shifted = String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
      return { from: char.toUpperCase(), to: shifted.toUpperCase() };
    });
}

export default function CaesarCipher() {
  const [inputText, setInputText] = useState("HELLO");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [output, setOutput] = useState("");
  const [steps, setSteps] = useState<{ from: string; to: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const nextId = useRef(1);

  const process = useCallback(() => {
    if (!inputText.trim()) { setOutput(""); setSteps([]); return; }
    const actualShift = mode === "encrypt" ? shift : 26 - shift;
    const result = caesarShift(inputText, actualShift);
    const stepList = getSteps(inputText, actualShift);
    setOutput(result);
    setSteps(stepList);
  }, [inputText, shift, mode]);

  useEffect(() => { process(); }, [process]);

  const handleEncryptDecrypt = () => {
    if (!output) return;
    const entry: HistoryEntry = {
      id: nextId.current++,
      input: inputText,
      output,
      key: shift,
      mode,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((h) => [entry, ...h].slice(0, 5));
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clear = () => {
    setInputText("");
    setOutput("");
    setSteps([]);
  };

  const stepColors = [
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  ];

  return (
    <section id="cipher" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Interactive Tool
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Caesar Cipher <span className="gradient-text">Encoder</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The Caesar Cipher shifts each letter by a fixed number. Julius Caesar used a shift of 3 to send secret military messages!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-xl font-bold mb-6">Settings</h3>

            <div className="flex gap-2 mb-6">
              {(["encrypt", "decrypt"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    mode === m
                      ? "gradient-bg text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {m === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Enter your message:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Secret Key (shift amount):{" "}
                <span className="text-primary font-black text-lg">{shift}</span>
              </label>
              <input
                type="range"
                min={1}
                max={25}
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>Key = {shift} (Julius Caesar used 3)</span>
                <span>25</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEncryptDecrypt}
                className="flex-1 gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              >
                {mode === "encrypt" ? "🔒 Encrypt!" : "🔓 Decrypt!"}
              </button>
              <button
                onClick={clear}
                className="px-4 bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-colors"
                title="Clear"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">
                  {mode === "encrypt" ? "🔒 Encrypted Message" : "🔓 Decrypted Message"}
                </h3>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 font-mono text-lg min-h-[80px] break-all">
                {output || <span className="text-muted-foreground text-sm">Output will appear here...</span>}
              </div>
            </div>

            {output && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>📱</span> QR Code
                </h3>
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeSVG value={output || " "} size={140} />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan this QR code to read the {mode === "encrypt" ? "encrypted" : "decrypted"} message
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {steps.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-8 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">
              📋 Step-by-Step Letter Changes <span className="text-muted-foreground text-sm font-normal">(shift = {mode === "encrypt" ? shift : 26 - shift})</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-mono font-bold ${
                    stepColors[i % stepColors.length]
                  } animate-fade-in`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
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
              <h3 className="text-xl font-bold">📜 Encryption History</h3>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> Clear History
              </button>
            </div>
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="bg-muted rounded-xl p-4 text-sm animate-slide-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      entry.mode === "encrypt"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    }`}>
                      {entry.mode === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}
                    </span>
                    <span className="text-muted-foreground text-xs">Key: {entry.key}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{entry.time}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="truncate max-w-[40%]">{entry.input}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[40%] text-primary font-bold">{entry.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
