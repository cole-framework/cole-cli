import { Transport, TransportOptions } from "./transport";
import Logger from "../core/tools/logger";
import fs from "fs";
import { ensurePathExists, fileOrDirExists } from "../core/tools/files.tools";

const logger = Logger.getLogger();

export class FileTransport implements Transport {
  writeOutput(data: string, options: FileTransportOptions): boolean {
    const { outputPath, overwrite = false } = options;
    try {
      if (!overwrite && fileOrDirExists(outputPath)) {
        logger.info(`skipped ${outputPath}`, `🔵`);
        return true;
      }

      ensurePathExists(outputPath);
      fs.writeFileSync(outputPath, data);
      logger.info(`created ${outputPath}`, `🟢`);
    } catch (ex) {
      logger.error(ex);
      return false;
    }

    return true;
  }
}

interface FileTransportOptions extends TransportOptions {
  outputPath: string;
  overwrite?: boolean;
}
