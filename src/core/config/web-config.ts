import { WebConfigData } from "./web-config.types";

export class WebConfig {
  public static create(data: WebConfigData): WebConfig {
    return new WebConfig(data.module, data.name, data.alias, data.package);
  }

  constructor(
    public readonly module: string,
    public readonly name: string,
    public readonly alias: string,
    public readonly pckg: string
  ) {}
}
