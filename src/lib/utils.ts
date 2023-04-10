let id = 0;

export function generateId() {
  return ++id;
}

export function stars(n: number) {
  return Array(n).fill("★").join("");
}

export function groupBy<Item extends Record<Key, string | number | symbol>, Key extends keyof Item>(
  items: Item[],
  key: Key
): Record<Item[Key], Item[]> {
  return items.reduce((groups, item) => {
    const group = item[key];
    if (groups[group]) {
      groups[group].push(item);
    } else {
      groups[group] = [item];
    }
    return groups;
  }, {} as Record<Item[Key], Item[]>);
}

export function checkAttrs<M>(obj: Partial<M>, attrs: (keyof M)[]): M {
  for (const attr of attrs) {
    if (!(attr in obj)) throw new TypeError(`missing attribute: ${String(attr)}`);
  }
  return obj as M;
}

export function sanitizeIntFromText(value: string, max: number) {
  const parsedValue = parseInt(value) || 0;
  return Math.min(Math.max(parsedValue, 0), max);
}
