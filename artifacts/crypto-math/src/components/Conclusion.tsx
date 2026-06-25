import { Shield, BookOpen, Star } from "lucide-react";

const keyPoints = [
  {
    icon: "🔐",
    title: "Mathematics is the Key",
    desc: "Every encryption system is built on maths — from simple addition (Caesar Cipher) to complex prime number theory (RSA).",
  },
  {
    icon: "🔄",
    title: "Modular Arithmetic Wraps Everything",
    desc: "The mod operation lets letters wrap around the alphabet, making encryption circular and systematic.",
  },
  {
    icon: "🌍",
    title: "Cryptography is Everywhere",
    desc: "Banking, messaging, passwords, and internet security all rely on cryptographic mathematics daily.",
  },
  {
    icon: "🏛️",
    title: "Ancient Yet Modern",
    desc: "From Julius Caesar's simple cipher to today's quantum-resistant algorithms, cryptography has evolved over 2,000 years.",
  },
  {
    icon: "🛡️",
    title: "The Digital Guardian",
    desc: "Modern cryptography is the invisible shield that protects billions of people's data and privacy every second.",
  },
  {
    icon: "🚀",
    title: "The Future is Encrypted",
    desc: "As technology evolves, so does cryptography. Quantum-safe encryption is already being developed for tomorrow's challenges.",
  },
];

export default function Conclusion() {
  return (
    <section id="conclusion" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Wrapping Up
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Project <span className="gradient-text">Conclusion</span>
          </h2>
        </div>

        <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border shadow-sm mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 gradient-bg rounded-xl shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">Summary</h3>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Through this project, we explored how <strong className="text-foreground">mathematics is the foundation of cryptography</strong> — the science of protecting information using secret codes. We started with the simple but powerful <strong className="text-foreground">Caesar Cipher</strong>, which Julius Caesar used over 2,000 years ago to send secret military messages.
                </p>
                <p>
                  We discovered that the Caesar Cipher works through <strong className="text-foreground">modular arithmetic</strong> — a branch of mathematics that makes letters "wrap around" the alphabet. The formula <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono">new_pos = (old_pos + shift) mod 26</code> shows how every encrypted letter is just a mathematical calculation!
                </p>
                <p>
                  Most importantly, we saw that cryptography isn't just an ancient curiosity — it <strong className="text-foreground">protects your life every day</strong>. Every bank transaction, every WhatsApp message, every password you type online is shielded by the same mathematical principles we studied, just with much more complex formulas.
                </p>
                <p>
                  Mathematics truly is the secret language that keeps our digital world safe. When we study numbers, patterns, and formulas in class, we're learning the same tools that protect billions of people around the world!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {keyPoints.map((point, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm card-hover animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-3">{point.icon}</div>
              <h4 className="font-bold text-lg mb-2">{point.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="rounded-3xl p-8 sm:p-12 text-center text-white"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)" }}
        >
          <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-black mb-4">The Big Takeaway</h3>
          <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
            "Mathematics is not just numbers and equations in a classroom — it is the invisible force that protects the digital world. Every letter you shift, every modular calculation you perform, brings you one step closer to understanding the code that keeps billions of people safe every single day."
          </p>
        </div>
      </div>
    </section>
  );
}
