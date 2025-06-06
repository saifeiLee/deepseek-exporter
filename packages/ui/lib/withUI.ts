import deepmerge from "deepmerge";
import type { Config } from "tailwindcss/types/config";

export function withUI(config: Config) {
  return deepmerge(config, {
    content: ["./node_modules/@extension/ui/lib/**/*.{js,ts,jsx,tsx}"],
  });
}
