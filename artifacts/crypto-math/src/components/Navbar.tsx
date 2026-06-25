import { useState } from "react";
import { Moon, Sun, Lock, Menu, X } from "lucide-react";

interface NavbarProps {
  dark: boolean;
  setDark: (v: boolean) => void;
}

const links = [
  { href: "#what-is-crypto", label: "Intro" },
  { href: "#history", label: "History" },
  { href: "#cipher-lab", label: "Cipher Lab" },
  { href: "#math", label: "Maths" },
  { href: "#quiz", label: "Quiz" },
  { href: "#challenge", label: "Challenge" },
  { href: "#fun-facts", label: "Fun Facts" },
  { href: "#conclusion", label: "Conclusion" },
];

export default function Navbar({ dark, setDark }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-bold text-primary text-lg shrink-0">
          <Lock className="w-5 h-5" />
          <span className="hidden sm:block">CryptoMath</span>
        </a>

        <div className="hidden xl:flex items-center gap-0.5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className="xl:hidden p-2 rounded-md bg-muted"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden bg-card border-t border-border px-4 pb-4 animate-fade-in grid grid-cols-2 gap-1 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
