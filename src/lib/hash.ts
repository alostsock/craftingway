import jsonStableStringify from "fast-json-stable-stringify";

// From https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function objectHash<T>(obj: T, ignoredProps?: ReadonlyArray<keyof T>): number {
  if (!ignoredProps) {
    return simpleHash(jsonStableStringify(obj));
  }

  const objectToHash = ignoredProps.reduce<Omit<Partial<T>, keyof T>>((obj, ignoredProp) => {
    const { [ignoredProp]: _, ...objectToHash } = obj;
    return objectToHash;
  }, obj as Partial<T>);

  return simpleHash(jsonStableStringify(objectToHash));
}
