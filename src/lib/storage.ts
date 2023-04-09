export default {
  store(key: string, json: string) {
    if (json === "undefined") return;

    localStorage.setItem(key, json);
  },

  retrieve<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item || item === "undefined") return null;

    return JSON.parse(item) as T;
  },
};
