import { GeneralConfigData } from "./general-config.types";

export class GeneralConfig {
  public static create(data: GeneralConfigData): GeneralConfig {
    return new GeneralConfig(
      data.headless_mode,
      data.source_dirname || "src",
      data.override || false,
      data.skip_tests || false,
      data.with_dependencies || false
    );
  }

  constructor(
    public readonly headlessMode: boolean,
    public readonly sourceDirname: string,
    public readonly override: boolean,
    public readonly skipTests: boolean,
    public readonly withDependencies: boolean
  ) {}
}