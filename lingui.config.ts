import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  locales: ["eng", "deu", "fra", "jpn"],
  sourceLocale: "eng",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}",
      include: ["src/components"],
    },
  ],
  compileNamespace: "ts",
};

export default config;
