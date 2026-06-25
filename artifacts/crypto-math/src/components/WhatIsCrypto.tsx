import { Shield, CreditCard, MessageSquare, Lock, Globe } from "lucide-react";

const whyCards = [
  {
    icon: Shield,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    title: "Protects Privacy",
    desc: "Keeps your personal messages and data safe from strangers.",
  },
  {
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    title: "Secures Banking",
    desc: "Encrypts every online transaction so only you and your bank can read it.",
  },
  {
    icon: MessageSquare,
    color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    title: "Safe Messaging",
    desc: "Apps like WhatsApp use end-to-end encryption so only the sender and receiver can read messages.",
  },
  {
    icon: Lock,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
    title: "Password Security",
    desc: "Websites store your password as a scrambled hash, not plain text.",
  },
];

const useCases = [
  {
    icon: "🏦",
    title: "Banking",
    desc: "Every time you use online banking or pay at a shop, cryptography encrypts your card number and PIN. Hackers cannot steal what they cannot read!",
    color: "border-l-4 border-blue-500",
  },
  {
    icon: "🔑",
    title: "Passwords",
    desc: 'Websites like Google scramble your password using a "hash function". Even the website cannot read your real password — only you know it.',
    color: "border-l-4 border-purple-500",
  },
  {
    icon: "💬",
    title: "Messaging Apps",
    desc: "WhatsApp, Signal, and iMessage use end-to-end encryption. Your messages travel in a locked box that only your friend's phone can open.",
    color: "border-l-4 border-green-500",
  },
  {
    icon: "🛡️",
    title: "Cybersecurity",
    desc: "Governments, armies, and companies use advanced cryptography to protect top-secret information from spies and hackers.",
    color: "border-l-4 border-red-500",
  },
];

export default function WhatIsCrypto() {
  return (
    <section id="what-is-crypto" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            The Basics
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            What is <span className="gradient-text">Cryptography?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Cryptography is the science of writing and reading secret messages. The word comes from the Greek words <em>kryptos</em> (hidden) and <em>graphein</em> (to write).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm card-hover">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-3">The Simple Explanation</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Imagine you want to send a secret message to your best friend, but you don't want anyone else to read it. You could agree on a <strong>secret code</strong> before hand — like shifting every letter by 3 positions in the alphabet.
            </p>
            <div className="bg-muted rounded-xl p-4 font-mono text-sm">
              <div className="text-green-600 dark:text-green-400 font-bold mb-1">Original:</div>
              <div className="mb-2">H E L L O</div>
              <div className="text-purple-600 dark:text-purple-400 font-bold mb-1">Encrypted (shift 3):</div>
              <div>K H O O R</div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm card-hover">
            <div className="text-5xl mb-4">🧮</div>
            <h3 className="text-2xl font-bold mb-3">How Mathematics Helps</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Mathematics is the backbone of cryptography! We use:
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { icon: "➕", text: "Addition and modular arithmetic to shift letters" },
                { icon: "🔢", text: "Number theory to create unbreakable codes" },
                { icon: "📐", text: "Prime numbers to protect internet security" },
                { icon: "🔄", text: "Patterns and sequences to scramble data" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">
            Why is Cryptography <span className="gradient-text">Important?</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyCards.map((card, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm card-hover text-center">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-8">
            Real-Life <span className="gradient-text">Uses</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((item, i) => (
              <div key={i} className={`bg-card rounded-2xl p-6 border border-border shadow-sm ${item.color} card-hover`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
