let id = 0;

export function generateId() {
  return ++id;
}

export function stars(n: number) {
  return Array(n).fill("★").join("");
}
