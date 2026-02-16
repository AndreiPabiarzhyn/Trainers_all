function pick(str){
  return str[Math.floor(Math.random() * str.length)];
}

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateStrongPassword(length = 12){
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_-+=[]{};:,.<>?";

  const all = lower + upper + digits + symbols;

  // гарантируем все типы
  const chars = [
    pick(lower),
    pick(upper),
    pick(digits),
    pick(symbols)
  ];

  while (chars.length < Math.max(length, 8)) {
    chars.push(pick(all));
  }

  return shuffle(chars).join("");
}
