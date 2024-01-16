import { Transport, TransportOptions, TransportStatus } from "./transport";
import fs from "fs";
import { ensurePathExists, fileOrDirExists } from "../core/tools/files.tools";

export class FileTransport implements Transport {
  writeOutput(data: string, options: FileTransportOptions): TransportStatus {
    const { outputPath, overwrite = false } = options;
    try {
      if (!overwrite && fileOrDirExists(outputPath)) {
        return "skipped";
      }

      ensurePathExists(outputPath);
      fs.writeFileSync(outputPath, data);
    } catch (ex) {
      console.log(ex);
      return "error";
    }

    return "created";
  }
}

interface FileTransportOptions extends TransportOptions {
  outputPath: string;
  overwrite?: boolean;
}
