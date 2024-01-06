import { Config } from "../../../core";

export abstract class ApiDataCreationStrategy {
  constructor(protected config: Config) {}

  public abstract apply(apiSchema: any, ...args: unknown[]);
}
