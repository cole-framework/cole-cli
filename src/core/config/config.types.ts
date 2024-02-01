import { CodeConfigData } from "./code-config.types";
import { CompilationConfigData } from "./compilation-config.types";
import { ComponentsConfigData } from "./components-config.types";
import { DatabaseConfigData } from "./database-config.types";
import { GeneralConfigData } from "./general-config.types";

export type ConfigAddons = {
  meta?: string;
  template?: string;
};

export type GeneratedPath = {
  path: string;
  marker: string;
  hasDynamicFilename: boolean;
};

export type ConfigData = {
  general: GeneralConfigData;
  compilation: CompilationConfigData;
  databases: DatabaseConfigData[];
  code: CodeConfigData;
  components: ComponentsConfigData;
};

export type ReservedType = {
  name: string;
  category: "FrameworkDefault" | "DatabaseType" | "Primitive";
};
