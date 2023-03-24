export default {
  store(key: string, json: string) {
    localStorage.setItem(key, json);
  },
  retrieve<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item) return null;

    return JSON.parse(item) as T;
  },
};
