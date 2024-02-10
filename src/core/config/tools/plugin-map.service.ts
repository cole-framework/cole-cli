import {
  ConfigTools,
  PluginMap,
  PluginMapObject,
  Result,
} from "@cole-framework/cole-cli-core";
import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import path from "path";

import DefaultPluginMap from "../../../defaults/plugin-map.json";

export class PluginMapService {
  private localPath: string;
  constructor(
    private url: string,
    localPath: string
  ) {
    this.localPath = path.join(process.cwd(), localPath);
  }

  async sync(): Promise<PluginMap> {
    const { content: currentPluginMap, failure: getLocalFailure } =
      await this.getLocal();
    const { content: latestPluginMap, failure: fetchFailure } =
      await this.fetch();

    if (getLocalFailure && latestPluginMap) {
      await this.setLocal(latestPluginMap.toObject());
      return latestPluginMap;
    }

    if (getLocalFailure && fetchFailure) {
      await this.setLocal(DefaultPluginMap);
      const { version, languages, databases, web_frameworks, services } =
        DefaultPluginMap;
      return new PluginMap(
        version,
        languages,
        databases,
        web_frameworks,
        services
      );
    }

    if (
      ConfigTools.versionToNumber(currentPluginMap.version) <
      ConfigTools.versionToNumber(latestPluginMap.version)
    ) {
      await this.setLocal(latestPluginMap.toObject());
      return latestPluginMap;
    }

    return currentPluginMap;
  }

  async fetch(): Promise<Result<PluginMap>> {
    const { url } = this;
    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        return Result.withContent(response.data);
      } else {
        return Result.withFailure(
          new Error(
            `Configuration download failed with status ${response.status}`
          )
        );
      }
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  async setLocal(map: PluginMapObject): Promise<Result<void>> {
    return writeFile(this.localPath, JSON.stringify(map, null, 2), "utf-8")
      .then(() => Result.withoutContent())
      .catch((error) => Result.withFailure(error));
  }

  async getLocal(): Promise<Result<PluginMap>> {
    return readFile(this.localPath, "utf-8")
      .then((local) => {
        const { version, languages, databases, web_frameworks, services } =
          JSON.parse(local);
        const map = new PluginMap(
          version,
          languages,
          databases,
          web_frameworks,
          services
        );
        return Result.withContent(map);
      })
      .catch((error) => Result.withFailure(error));
  }
}
