import { WebFrameworkConfigJaon } from "@cole-framework/cole-cli-core";

export class WebConfig {
  public static create(data: WebFrameworkConfigJaon): WebConfig {
    return new WebConfig(data.name, data.alias);
  }

  constructor(
    public readonly name: string,
    public readonly alias: string
  ) {}
}
