import { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

const timeline = [
  {
    year: "~1900 BC",
    era: "Ancient Egypt",
    emoji: "🏺",
    title: "The First Codes",
    desc: "Ancient Egyptians used unusual hieroglyphs in tomb inscriptions — not to confuse, but to intrigue and add mystery. This is one of the earliest known uses of a transformed writing system.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    year: "~500 BC",
    era: "Sparta, Greece",
    emoji: "⚔️",
    title: "The Scytale",
    desc: "Spartans used a wooden rod called a 'scytale'. They wrapped a strip of leather around the rod, wrote a message along it, then unwound it. Only a rod of the same thickness could decode the message!",
    color: "from-blue-400 to-indigo-500",
  },
  {
    year: "~58 BC",
    era: "Roman Empire",
    emoji: "🏛️",
    title: "Julius Caesar's Cipher",
    desc: "Julius Caesar used a substitution cipher — shifting each letter by 3 positions — to communicate with his generals. HELLO became KHOOR. This is called the Caesar Cipher and it is still studied today!",
    color: "from-purple-400 to-violet-500",
  },
  {
    year: "~800 AD",
    era: "Arab World",
    emoji: "📜",
    title: "Al-Kindi and Frequency Analysis",
    desc: "Arab scholar Al-Kindi wrote 'A Manuscript on Deciphering Cryptographic Messages' — the first book about breaking codes using frequency analysis. He realized some letters appear more often than others.",
    color: "from-green-400 to-teal-500",
  },
  {
    year: "1467 AD",
    era: "Renaissance Italy",
    emoji: "🎨",
    title: "Vigenère Cipher",
    desc: "Leon Battista Alberti invented the concept of polyalphabetic substitution — using multiple shifted alphabets. The Vigenère cipher was so hard to break it was called 'le chiffre indéchiffrable' (the unbreakable cipher)!",
    color: "from-pink-400 to-rose-500",
  },
  {
    year: "1940s",
    era: "World War 2",
    emoji: "🔑",
    title: "The Enigma Machine",
    desc: "Nazi Germany used a machine called Enigma to encrypt military messages. British mathematician Alan Turing and his team cracked it — shortening the war by an estimated 2 years and saving 14 million lives.",
    color: "from-red-400 to-orange-500",
  },
  {
    year: "1977",
    era: "Modern Era",
    emoji: "💻",
    title: "RSA Encryption",
    desc: "Rivest, Shamir, and Adleman invented RSA — an encryption system based on the mathematics of large prime numbers. This is what protects your internet banking and online shopping today!",
    color: "from-cyan-400 to-blue-500",
  },
  {
    year: "Today",
    era: "Digital World",
    emoji: "🌐",
    title: "Cryptography Everywhere",
    desc: "Modern cryptography uses 256-bit AES encryption, elliptic curves, and quantum-resistant algorithms. Every HTTPS website, every WhatsApp message, every bank transfer is protected by advanced mathematics!",
    color: "from-violet-400 to-purple-500",
  },
];

const facts = [
  "The word 'cryptography' comes from Greek: kryptos (hidden) + graphein (to write).",
  "Alan Turing, who cracked Enigma, is considered the father of modern computing.",
  "A Caesar Cipher can only have 25 unique keys (shifts 1–25).",
  "The ancient Hebrew 'Atbash cipher' replaced A with Z, B with Y, etc.",
  "The Navajo Code Talkers in WW2 used the Navajo language itself as a code.",
  "Modern RSA encryption would take billions of years to crack with today's computers.",
];

export default function HistorySection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="history" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Through the Ages
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            History of <span className="gradient-text">Cryptography</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Secret codes have existed for thousands of years. From ancient Egypt to the digital age, let's journey through the history of cryptography!
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-400 opacity-30" />

          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div
                key={i}
                className={`relative flex flex-col sm:flex-row gap-4 ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div className="flex-1 sm:text-right flex flex-col items-start sm:items-end pl-14 sm:pl-0">
                  {i % 2 === 0 && (
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="bg-card border border-border rounded-2xl p-5 shadow-sm card-hover text-left sm:text-right w-full max-w-md animate-fade-in"
                    >
                      <div className={`inline-block text-3xl mb-2`}>{item.emoji}</div>
                      <div className={`text-xs font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1`}>
                        {item.year} · {item.era}
                      </div>
                      <div className="font-bold text-lg mb-1">{item.title}</div>
                      <div className="text-muted-foreground text-sm line-clamp-2">{item.desc}</div>
                      <div className="mt-2 text-primary text-xs font-medium flex items-center gap-1 sm:justify-end">
                        {expanded === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expanded === i ? "Less" : "Read more"}
                      </div>
                      {expanded === i && (
                        <div className="mt-2 text-muted-foreground text-sm animate-fade-in">{item.desc}</div>
                      )}
                    </button>
                  )}
                </div>

                <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-5 z-10">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.color} shadow-lg`} />
                </div>

                <div className="flex-1 pl-14 sm:pl-0">
                  {i % 2 !== 0 && (
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="bg-card border border-border rounded-2xl p-5 shadow-sm card-hover text-left w-full max-w-md animate-fade-in"
                    >
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <div className={`text-xs font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1`}>
                        {item.year} · {item.era}
                      </div>
                      <div className="font-bold text-lg mb-1">{item.title}</div>
                      <div className="text-muted-foreground text-sm line-clamp-2">{item.desc}</div>
                      <div className="mt-2 text-primary text-xs font-medium flex items-center gap-1">
                        {expanded === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expanded === i ? "Less" : "Read more"}
                      </div>
                      {expanded === i && (
                        <div className="mt-2 text-muted-foreground text-sm animate-fade-in">{item.desc}</div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" /> Interesting Historical Facts
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {facts.map((fact, i) => (
              <div key={i} className="flex items-start gap-3 bg-muted rounded-xl p-4">
                <span className="text-primary font-black text-lg shrink-0">#{i + 1}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
