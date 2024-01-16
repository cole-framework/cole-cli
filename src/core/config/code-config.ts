import { TypeScriptPrimitives } from "../consts";
import { CodeConfigData } from "./code-config.types";

export class CodeConfig {
  public static create(data: CodeConfigData): CodeConfig {
    return new CodeConfig(
      data.module,
      data.name,
      data.alias,
      data.types || TypeScriptPrimitives
    );
  }

  constructor(
    public readonly module: string,
    public readonly name: string,
    public readonly alias: string,
    public readonly types: string[]
  ) {}
}
