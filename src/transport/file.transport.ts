import { Transport, TransportOptions, TransportStatus } from "./transport";
import fs from "fs";
import { ensurePathExists, fileOrDirExists } from "../core/tools/files.tools";

export class FileTransport implements Transport {
  writeOutput(data: string, options: FileTransportOptions): TransportStatus {
    const { outputPath, overwrite } = options;
    try {
      const exists = fileOrDirExists(outputPath);
      if (!overwrite && exists) {
        return "skipped";
      }

      ensurePathExists(outputPath);
      fs.writeFileSync(outputPath, data);

      return exists ? "modified" : "created";
    } catch (ex) {
      console.log(ex);
      return "error";
    }
  }
}

interface FileTransportOptions extends TransportOptions {
  outputPath: string;
  overwrite?: boolean;
}
