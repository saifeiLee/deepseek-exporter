import fs from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";
import { ManifestParser } from "@extension/dev-utils";
import type { PluginOption } from "vite";

const rootDir = resolve(__dirname, "..", "..");
const manifestFile = resolve(rootDir, "manifest.js");

const getManifestWithCacheBurst = (): Promise<{
  default: chrome.runtime.ManifestV3;
}> => {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === "win32") {
    return import(withCacheBurst(pathToFileURL(manifestFile).href));
  }
  return import(withCacheBurst(manifestFile));
};

export default function makeManifestPlugin(config: {
  outDir: string;
}): PluginOption {
  function makeManifest(manifest: chrome.runtime.ManifestV3, to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true });
    }
    const manifestPath = resolve(to, "manifest.json");

    const isFirefox = process.env.__FIREFOX__ === "true";

    fs.writeFileSync(
      manifestPath,
      ManifestParser.convertManifestToString(
        manifest,
        isFirefox ? "firefox" : "chrome"
      )
    );
    console.log(`Manifest file copy complete: ${manifestPath}.`);
  }
  return {
    name: "make-manifest",
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const outDir = config.outDir;
      const manifest = await getManifestWithCacheBurst();
      makeManifest(manifest.default, outDir);
    },
  };
}
