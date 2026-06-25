import { Shield, Lock, Key, Zap } from "lucide-react";

const floatingIcons = [
  { icon: Lock, color: "text-purple-400", style: "top-8 left-8 animate-float", delay: "0s" },
  { icon: Key, color: "text-blue-400", style: "top-12 right-16 animate-float", delay: "0.5s" },
  { icon: Shield, color: "text-cyan-400", style: "bottom-8 left-20 animate-float", delay: "1s" },
  { icon: Zap, color: "text-pink-400", style: "bottom-12 right-8 animate-float", delay: "1.5s" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      {floatingIcons.map(({ icon: Icon, color, style, delay }, i) => (
        <div
          key={i}
          className={`absolute opacity-30 ${style}`}
          style={{ animationDelay: delay }}
        >
          <Icon className={`w-16 h-16 ${color}`} />
        </div>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto animate-slide-in-up">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-white/80">
          <Shield className="w-4 h-4 text-purple-400" />
          Class 7 Mathematics Project
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Cryptography
          <span className="block gradient-text">Using Mathematics</span>
        </h1>

        <p className="text-xl sm:text-2xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover the secret language of codes — how mathematics protects your messages, passwords, and data!
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <a
            href="#cipher"
            className="gradient-bg text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          >
            Try Cipher Encoder
          </a>
          <a
            href="#quiz"
            className="bg-white/10 border border-white/30 text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
          >
            Take the Quiz
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-white/70">
          {[
            { label: "Caesar Cipher", value: "🔐" },
            { label: "QR Generator", value: "📱" },
            { label: "Interactive Quiz", value: "🧠" },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 border border-white/20 rounded-xl p-3">
              <div className="text-2xl mb-1">{item.value}</div>
              <div className="text-xs font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
