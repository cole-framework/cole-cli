import { Result } from "@cole-framework/cole-cli-core";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { CliConfig } from "./config.types";
import DefaultCliConfig from "../defaults/config.json";

export class CliConfigService {
  private localPath = path.join(process.cwd(), "./cole/default.json");
  constructor() {}

  async sync(): Promise<CliConfig> {
    const { content: currentConfig, failure: getLocalFailure } =
      await this.getLocal();

    if (getLocalFailure) {
      await this.setLocal(DefaultCliConfig);
      return DefaultCliConfig;
    }

    return currentConfig;
  }

  async setLocal(config: CliConfig): Promise<Result<void>> {
    return writeFile(this.localPath, JSON.stringify(config, null, 2), "utf-8")
      .then(() => Result.withoutContent())
      .catch((error) => Result.withFailure(error));
  }

  async getLocal(): Promise<Result<CliConfig>> {
    return readFile(this.localPath, "utf-8")
      .then((local) => {
        return Result.withContent(JSON.parse(local));
      })
      .catch((error) => Result.withFailure(error));
  }
}
