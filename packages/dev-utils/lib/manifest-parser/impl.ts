import type { ManifestParserInterface, Manifest } from "./type";

export const ManifestParserImpl: ManifestParserInterface = {
  convertManifestToString: (manifest, env) => {
    if (env === "firefox") {
      manifest = convertToFirefoxCompatibleManifest(manifest);
    }

    return JSON.stringify(manifest, null, 2);
  },
};

function convertToFirefoxCompatibleManifest(manifest: Manifest) {
  const manifestCopy = {
    ...manifest,
  } as { [key: string]: unknown };
  manifestCopy.background = {
    scripts: [manifest.background?.service_worker],
    type: "module",
  };

  manifestCopy.browser_specific_settings = {
    gecko: {
      id: "{4F60F494-3813-03A2-483E-8411A5562E64}",
      strict_min_version: "109.0",
    },
  };
  return manifestCopy as Manifest;
}
