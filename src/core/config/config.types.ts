import { CodeConfigData } from "./code-config.types";
import { ComponentsConfigData } from "./components-config.types";
import { DatabaseConfigData } from "./database-config.types";
import { GeneralConfigData } from "./general-config.types";

export type ConfigAddons = {
  meta?: string;
};

export type GeneratedPath = {
  path: string;
  marker: string;
  hasDynamicFilename: boolean;
};

export type ConfigData = {
  general: GeneralConfigData;
  databases: DatabaseConfigData[];
  code: CodeConfigData;
  components: ComponentsConfigData;
};

export type ReservedType = {
  name: string;
  category: "FrameworkDefault" | "DatabaseType" | "Primitive";
};