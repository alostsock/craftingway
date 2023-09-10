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

export function objectHash(obj: object): number {
  return simpleHash(jsonStableStringify(obj));
}
