import { useState } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

const facts = [
  {
    emoji: "⚔️",
    title: "Julius Caesar's Secret Weapon",
    fact: "Julius Caesar (100–44 BC) created the Caesar Cipher to communicate secretly with his generals during wars. He always used a shift of 3, and his enemies had no idea how to decode his messages!",
    color: "from-purple-500 to-indigo-600",
  },
  {
    emoji: "🌐",
    title: "The Internet is Encrypted Right Now!",
    fact: "Every time you see 'https://' in your browser, your data is being protected by modern cryptography. Without it, anyone on the same WiFi could read your passwords and messages!",
    color: "from-blue-500 to-cyan-600",
  },
  {
    emoji: "🏦",
    title: "Trillions Protected Daily",
    fact: "Banks process over $5 trillion in transactions every day, all protected by cryptography. Without it, online banking would be impossible and anyone could steal your money!",
    color: "from-green-500 to-teal-600",
  },
  {
    emoji: "🔐",
    title: "Enigma and World War 2",
    fact: "During World War 2, Nazi Germany used a machine called Enigma to encrypt messages. British mathematician Alan Turing cracked the code, which helped end the war earlier and saved millions of lives!",
    color: "from-orange-500 to-red-600",
  },
  {
    emoji: "🔢",
    title: "Prime Numbers Protect You",
    fact: "Modern internet security uses 'RSA encryption' based on prime numbers. It relies on the fact that multiplying two huge prime numbers is easy, but splitting the result back is nearly impossible — even for supercomputers!",
    color: "from-pink-500 to-rose-600",
  },
  {
    emoji: "📱",
    title: "Your WhatsApp is End-to-End Encrypted",
    fact: "WhatsApp uses a protocol called Signal Protocol with 256-bit encryption. Even WhatsApp itself cannot read your messages — only you and the person you're texting can!",
    color: "from-violet-500 to-purple-600",
  },
  {
    emoji: "🚀",
    title: "Quantum Computers — The Future Threat",
    fact: "Scientists are working on quantum computers that could one day break today's encryption! That's why cryptographers are already building 'quantum-safe' encryption algorithms for the future.",
    color: "from-indigo-500 to-blue-600",
  },
];

export default function FunFacts() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + facts.length) % facts.length);
  const next = () => setActive((a) => (a + 1) % facts.length);

  return (
    <section id="fun-facts" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Did You Know?
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Amazing <span className="gradient-text">Fun Facts</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cryptography has a fascinating history and shapes our modern world!
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto mb-10">
          <div
            className={`bg-gradient-to-br ${facts[active].color} rounded-3xl p-8 sm:p-12 text-white text-center animate-fade-in shadow-2xl`}
            key={active}
          >
            <div className="text-7xl mb-6">{facts[active].emoji}</div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">{facts[active].title}</h3>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              {facts[active].fact}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-3 bg-card border border-border rounded-full shadow hover:bg-muted transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {facts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === active ? "gradient-bg scale-125" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-3 bg-card border border-border rounded-full shadow hover:bg-muted transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-3">
            {active + 1} / {facts.length}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facts.map((fact, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`bg-card border rounded-2xl p-4 text-left transition-all card-hover ${
                i === active ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className="text-3xl mb-2">{fact.emoji}</div>
              <div className="font-semibold text-sm leading-tight">{fact.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
