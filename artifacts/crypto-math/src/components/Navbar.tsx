import { useState } from "react";
import { Moon, Sun, Lock, Menu, X } from "lucide-react";

interface NavbarProps {
  dark: boolean;
  setDark: (v: boolean) => void;
}

const links = [
  { href: "#what-is-crypto", label: "Intro" },
  { href: "#history",        label: "History" },
  { href: "#comparison",     label: "Compare" },
  { href: "#cipher-lab",     label: "Cipher Lab" },
  { href: "#math",           label: "Maths" },
  { href: "#quiz",           label: "Quiz" },
  { href: "#challenge",      label: "Challenge" },
  { href: "#agent",          label: "🕵️ Agent" },
  { href: "#stats",          label: "Stats" },
  { href: "#fun-facts",      label: "Fun Facts" },
  { href: "#codebreaker",    label: "🔓 Lab" },
];

export default function Navbar({ dark, setDark }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-bold text-primary text-base shrink-0">
          <Lock className="w-5 h-5" />
          <span className="hidden md:block text-sm">Mystery Messaging Machine</span>
        </a>

        <div className="hidden xl:flex items-center gap-0.5 overflow-x-auto">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
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
            {dark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
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
        <div className="xl:hidden bg-card border-t border-border px-4 pb-4 pt-2 animate-fade-in grid grid-cols-2 sm:grid-cols-3 gap-1">
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
