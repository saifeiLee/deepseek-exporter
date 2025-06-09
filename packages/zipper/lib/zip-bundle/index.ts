import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
} from "node:fs";
import { posix, resolve } from "node:path";
import glob from "fast-glob";
import { AsyncZipDeflate, Zip } from "fflate";

function toMB(bytes: number): number {
  return bytes / 1024 / 1024;
}

function ensureBuildDirectoryExists(buildDirectory: string): void {
  if (!existsSync(buildDirectory)) {
    mkdirSync(buildDirectory, { recursive: true });
  }
}

function logPackageSize(size: number, startTime: number): void {
  console.log(
    `Zip Package size: ${toMB(size).toFixed(2)} MB in ${Date.now() - startTime}ms`
  );
}

function streamFileToZip(
  absPath: string,
  relPath: string,
  zip: Zip,
  onAbort: () => void,
  onError: (error: Error) => void
): void {
  const data = new AsyncZipDeflate(relPath, { level: 9 });
  zip.add(data);

  createReadStream(absPath)
    .on("data", (chunk: string | Buffer) => {
      const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
      data.push(buffer, false);
    })
    .on("end", () => data.push(new Uint8Array(0), true))
    .on("error", (error) => {
      onAbort();
      onError(error);
    });
}

export const zipBundle = async (
  {
    distDirectory,
    buildDirectory,
    archiveName,
  }: {
    distDirectory: string;
    buildDirectory: string;
    archiveName: string;
  },
  withMaps = false
): Promise<void> => {
  ensureBuildDirectoryExists(buildDirectory);

  const zipFilePath = resolve(buildDirectory, archiveName);
  const output = createWriteStream(zipFilePath);

  const fileList = await glob(["**/*", ...(!withMaps ? ["!**/*.map"] : [])], {
    cwd: distDirectory,
    onlyFiles: true,
  });
  return new Promise((pResolve, pReject) => {
    let aborted = false;
    let totalSize = 0;
    const timer = Date.now();
    const zip = new Zip((err, data, final) => {
      if (err) {
        pReject(err);
      } else {
        totalSize += data.length;
        output.write(data);
        if (final) {
          logPackageSize(totalSize, timer);
          output.end();
          pResolve();
        }
      }
    });
    for (const file of fileList) {
      if (aborted) return;
      const absPath = resolve(distDirectory, file);
      const relPosixPath = posix.normalize(file);

      console.log(`Adding file: ${relPosixPath}`);
      streamFileToZip(
        absPath,
        relPosixPath,
        zip,
        () => {
          aborted = true;
          zip.terminate();
        },
        (error) => pReject(`Error reading file ${absPath}: ${error.message}`)
      );
    }

    zip.end();
  });
};
