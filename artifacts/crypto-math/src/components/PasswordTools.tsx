import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Shield, Eye, EyeOff } from "lucide-react";
import { showToast } from "../utils/toast";

type Tab = "generator" | "checker";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS  = "0123456789";
const SYMS  = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(len: number, upper: boolean, lower: boolean, nums: boolean, syms: boolean): string {
  let pool = "";
  if (upper) pool += UPPER;
  if (lower) pool += LOWER;
  if (nums)  pool += NUMS;
  if (syms)  pool += SYMS;
  if (!pool) pool = LOWER + NUMS;
  return Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
}

function calcStrength(pw: string): { score: number; label: string; color: string; criteria: { text: string; met: boolean }[] } {
  const criteria = [
    { text: "At least 8 characters",        met: pw.length >= 8 },
    { text: "At least 12 characters",        met: pw.length >= 12 },
    { text: "Contains uppercase letter",     met: /[A-Z]/.test(pw) },
    { text: "Contains lowercase letter",     met: /[a-z]/.test(pw) },
    { text: "Contains number",               met: /[0-9]/.test(pw) },
    { text: "Contains special character",    met: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = criteria.filter((c) => c.met).length;
  const label = score <= 1 ? "Very Weak" : score <= 2 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Good" : score <= 5 ? "Strong" : "Very Strong";
  const color = score <= 1 ? "bg-red-500" : score <= 2 ? "bg-orange-500" : score <= 3 ? "bg-yellow-500" : score <= 4 ? "bg-blue-500" : score <= 5 ? "bg-green-500" : "bg-emerald-500";
  return { score, label, color, criteria };
}

export default function PasswordTools() {
  const [tab, setTab] = useState<Tab>("generator");

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums,  setUseNums]  = useState(true);
  const [useSyms,  setUseSyms]  = useState(false);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const [checkPw, setCheckPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  const generate = useCallback(() => {
    const pw = generatePassword(length, useUpper, useLower, useNums, useSyms);
    setGenerated(pw);
    setCopied(false);
  }, [length, useUpper, useLower, useNums, useSyms]);

  const copyPw = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    setCopied(true);
    showToast("Password copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = checkPw ? calcStrength(checkPw) : null;

  return (
    <section id="password-tools" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🔑 Security Tools
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Password <span className="gradient-text">Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Generate secure passwords and test the strength of any password — using the same mathematics behind real cryptography!
          </p>
        </div>

        <div className="flex gap-2 mb-8 bg-muted p-1.5 rounded-2xl max-w-xs mx-auto">
          {(["generator", "checker"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${tab === t ? "gradient-bg text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "generator" ? "🔐 Generator" : "🛡️ Checker"}
            </button>
          ))}
        </div>

        {tab === "generator" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm animate-fade-in">
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Password Length</span>
                <span className="text-primary font-black">{length} characters</span>
              </div>
              <input type="range" min={6} max={32} value={length} onChange={(e) => setLength(+e.target.value)}
                className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>6</span><span>32</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Uppercase (A–Z)", val: useUpper, set: setUseUpper },
                { label: "Lowercase (a–z)", val: useLower, set: setUseLower },
                { label: "Numbers (0–9)",   val: useNums,  set: setUseNums },
                { label: "Symbols (!@#$)",  val: useSyms,  set: setUseSyms },
              ].map(({ label, val, set }) => (
                <button key={label} onClick={() => set(!val)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold border-2 transition-all ${val ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs ${val ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}>
                    {val && "✓"}
                  </div>
                  {label}
                </button>
              ))}
            </div>

            <button onClick={generate}
              className="w-full gradient-bg text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg mb-4">
              🎲 Generate Password
            </button>

            {generated && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 bg-muted border border-border rounded-2xl px-4 py-4 mb-3">
                  <code className="flex-1 font-mono text-base break-all text-foreground select-all">{generated}</code>
                  <button onClick={copyPw} className="shrink-0 p-2 rounded-xl hover:bg-muted/70 transition-all">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                  </button>
                  <button onClick={generate} className="shrink-0 p-2 rounded-xl hover:bg-muted/70 transition-all">
                    <RefreshCw className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                {(() => { const s = calcStrength(generated); return (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full transition-all ${s.color}`} style={{ width: `${(s.score / 6) * 100}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${s.score >= 5 ? "text-green-500" : s.score >= 3 ? "text-yellow-500" : "text-red-500"}`}>{s.label}</span>
                  </div>
                ); })()}
              </div>
            )}

            <div className="mt-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
              <div className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">📚 The Maths of Password Security</div>
              <p className="text-sm text-foreground">
                A password with {length} characters from a pool of {(useUpper?26:0)+(useLower?26:0)+(useNums?10:0)+(useSyms?28:0) || 36} characters has{" "}
                <strong>{((useUpper?26:0)+(useLower?26:0)+(useNums?10:0)+(useSyms?28:0)||36)}^{length}</strong> possible combinations.
                That's why length + variety = security!
              </p>
            </div>
          </div>
        )}

        {tab === "checker" && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm animate-fade-in">
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Enter any password to test:</label>
              <div className="flex gap-2">
                <input
                  type={showPw ? "text" : "password"}
                  value={checkPw}
                  onChange={(e) => setCheckPw(e.target.value)}
                  placeholder="Type a password here..."
                  className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
                <button onClick={() => setShowPw(!showPw)} className="p-3 bg-muted border border-border rounded-xl hover:bg-muted/70 transition-all">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {strength && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span>Strength</span>
                    <span className={strength.score >= 5 ? "text-green-500" : strength.score >= 3 ? "text-yellow-500" : "text-red-500"}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-3 rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${(strength.score / 6) * 100}%` }} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  {strength.criteria.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${c.met ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                      <Shield className={`w-4 h-4 shrink-0 ${c.met ? "text-green-500" : "text-muted-foreground"}`} />
                      <span>{c.text}</span>
                      {c.met && <span className="ml-auto text-green-500 font-bold">✓</span>}
                    </div>
                  ))}
                </div>

                <div className={`rounded-2xl p-4 ${strength.score >= 5 ? "bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800" : strength.score >= 3 ? "bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800" : "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800"}`}>
                  <div className="font-bold text-sm mb-1">
                    {strength.score >= 5 ? "✅ This is a strong password!" : strength.score >= 3 ? "⚠️ This password could be stronger." : "❌ This password is weak — improve it!"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {strength.score >= 5 ? "It meets most security requirements. Use a unique password for every account." : "Try adding uppercase letters, numbers, or symbols to make it harder to crack."}
                  </p>
                </div>
              </div>
            )}

            {!checkPw && (
              <div className="text-center py-10 text-muted-foreground">
                <div className="text-5xl mb-3">🔑</div>
                <div className="text-sm">Type any password above to instantly see its strength</div>
                <div className="text-xs mt-1">Nothing is stored or sent anywhere</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
