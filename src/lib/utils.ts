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
