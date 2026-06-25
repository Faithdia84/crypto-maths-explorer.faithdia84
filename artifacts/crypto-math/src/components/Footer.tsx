import { Lock, Heart, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-10 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-primary font-bold text-xl mb-3">
          <Lock className="w-5 h-5" />
          Cryptography Using Mathematics
        </div>

        <div className="section-divider w-48 mx-auto mb-6" />

        <p className="text-muted-foreground text-sm mb-6">
          Created with <Heart className="w-4 h-4 text-red-500 inline mx-1" /> for the love of mathematics
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-8">
          {[
            "Caesar Cipher",
            "Modular Arithmetic",
            "QR Codes",
            "Interactive Quiz",
            "Fun Facts",
          ].map((tag) => (
            <span key={tag} className="bg-muted px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-sm">
          <div className="bg-muted rounded-xl p-3">
            <div className="font-bold text-foreground mb-1">🔐 Topic</div>
            <div className="text-muted-foreground">Cryptography</div>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <div className="font-bold text-foreground mb-1">📚 Subject</div>
            <div className="text-muted-foreground">Mathematics</div>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <div className="font-bold text-foreground mb-1">🎓 Class</div>
            <div className="text-muted-foreground">Grade 7</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Built with React, TypeScript &amp; Mathematics 🧮
        </p>
      </div>
    </footer>
  );
}
