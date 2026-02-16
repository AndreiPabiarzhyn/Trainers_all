export const RULES = [
  { id: "len", test: (pwd) => pwd.length >= 8 },
  { id: "lower", test: (pwd) => /[a-z]/.test(pwd) },
  { id: "upper", test: (pwd) => /[A-Z]/.test(pwd) },
  { id: "digit", test: (pwd) => /\d/.test(pwd) },
  { id: "symbol", test: (pwd) => /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|]/.test(pwd) }
];

export function evaluatePassword(pwd){
  const results = {};
  let score = 0;

  for (const rule of RULES) {
    const ok = rule.test(pwd);
    results[rule.id] = ok;
    if (ok) score++;
  }

  return { score, results };
}
