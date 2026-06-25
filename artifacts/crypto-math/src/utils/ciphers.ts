export const MORSE: Record<string, string> = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....",
  I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.",
  Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-",
  Y:"-.--", Z:"--..", "0":"-----", "1":".----", "2":"..---", "3":"...--",
  "4":"....-", "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----.",
  " ":"/"
};
export const MORSE_REV: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);
export const SYMBOL_MAP: Record<string, string> = {
  A:"@", B:"#", C:"$", D:"%", E:"&", F:"*", G:"!", H:"?", I:"^", J:"~",
  K:"+", L:"-", M:"=", N:"|", O:"<", P:">", Q:"/", R:"\\", S:";", T:":",
  U:"[", V:"]", W:"{", X:"}", Y:"(", Z:")"
};
export const SYMBOL_REV: Record<string, string> = Object.fromEntries(
  Object.entries(SYMBOL_MAP).map(([k, v]) => [v, k])
);

export function caesarShift(text: string, shift: number): string {
  return text.split("").map((char) => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
    }
    return char;
  }).join("");
}
export function toNumber(text: string): string {
  return text.toUpperCase().split("").map((c) => {
    if (/[A-Z]/.test(c)) return String(c.charCodeAt(0) - 64);
    if (c === " ") return "0";
    return c;
  }).join(" ");
}
export function fromNumber(text: string): string {
  return text.trim().split(/\s+/).map((n) => {
    const num = parseInt(n);
    if (num >= 1 && num <= 26) return String.fromCharCode(num + 64);
    if (num === 0) return " ";
    return n;
  }).join("");
}
export function toMorse(text: string): string {
  return text.toUpperCase().split("").map((c) => MORSE[c] || c).join(" ");
}
export function fromMorse(text: string): string {
  return text.trim().split(/\s+/).map((code) => MORSE_REV[code] || code).join("");
}
export function toSymbol(text: string): string {
  return text.toUpperCase().split("").map((c) => SYMBOL_MAP[c] || c).join(" ");
}
export function fromSymbol(text: string): string {
  return text.trim().split(/\s+/).map((s) => SYMBOL_REV[s] || s).join("");
}
export function toBinary(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}
export function fromBinary(text: string): string {
  return text.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}
