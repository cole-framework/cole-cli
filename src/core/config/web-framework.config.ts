import { WebFrameworkConfigJaon } from "@cole-framework/cole-cli-core";

export class WebFrameworkConfig {
  public static create(data: WebFrameworkConfigJaon): WebFrameworkConfig {
    return new WebFrameworkConfig(data.name, data.alias);
  }

  constructor(
    public readonly name: string,
    public readonly alias: string
  ) {}
}
