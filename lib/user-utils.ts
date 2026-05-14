const adjectives = ["weird", "sleepy", "funky", "brave", "shiny", "cool", "mystic", "silent", "happy", "golden", "pixel", "cosmic", "neon", "velvet", "electric"];
const nouns = ["prawn", "kitten", "eagle", "tiger", "panda", "fox", "dragon", "wolf", "otter", "whale", "phoenix", "robot", "star", "moon", "ghost"];

export function generateRandomName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  
  // capitalize first letters for display name
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const displayName = `${capitalize(adj)} ${capitalize(noun)}`;
  const handle = `@${adj}-${noun}-${num}`;
  
  return { displayName, handle };
}

export function getInitials(name: string) {
  if (!name) return "??";
  // Split by space or hyphen
  const parts = name.split(/[\s-]/);
  const initials = parts
    .map(p => p[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
  return initials.slice(0, 2);
}
