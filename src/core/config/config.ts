import { LanguagePluginConfig } from "@cole-framework/cole-cli-core";
import { CliConfig } from "../config.types";
import { LanguageConfig } from "./language-config";
import { CompilationConfig } from "./compilation-config";
import { ComponentsConfig } from "./components-config";
import { ComponentsConfigTools } from "./components-config.tools";
import { ReservedType } from "./config.types";
import { DatabaseConfig } from "./database-config";
import { GeneralConfig } from "./general-config";
import { WebConfig } from "./web-config";
import { ProjectConfig } from "../../commands/api/common/project.config";

export class Config {
  public static create(
    cliConfig: CliConfig,
    pluginConfig: LanguagePluginConfig,
    options: any
  ): Config {
    const general = GeneralConfig.create(cliConfig);
    const compilation = CompilationConfig.create(
      cliConfig,
      pluginConfig.language
    );
    const databases = pluginConfig.databases.map(DatabaseConfig.create);
    const web = pluginConfig.web_frameworks.map(WebConfig.create);
    const language = LanguageConfig.create(pluginConfig.language);
    const components = ComponentsConfig.create(
      pluginConfig.language.source_path,
      pluginConfig.architecture.components
    );
    const project = ProjectConfig.create(options, cliConfig);

    return new Config(
      general,
      compilation,
      databases,
      language,
      web,
      components,
      project
    );
  }

  private __allReservedTypes: ReservedType[] = [];

  constructor(
    public readonly general: GeneralConfig,
    public readonly compilation: CompilationConfig,
    public readonly databases: DatabaseConfig[],
    public readonly code: LanguageConfig,
    public readonly web: WebConfig[],
    public readonly components: ComponentsConfig,
    public readonly project: ProjectConfig
  ) {
    if (Array.isArray(databases)) {
      databases.forEach((db) => {
        if (Array.isArray(db.mappings)) {
          db.mappings.forEach((mapping) =>
            this.__allReservedTypes.push({
              name: mapping.dbType,
              category: "DatabaseType",
            })
          );
        }
      });
    }

    if (Array.isArray(code.types)) {
      code.types.forEach((name) => {
        this.__allReservedTypes.push({
          name,
          category: "Primitive",
        });
      });
    }

    Object.keys(components).forEach((name) => {
      if (components[name]?.defaults) {
        ComponentsConfigTools.listTypes(components[name].defaults).forEach(
          (name) => {
            this.__allReservedTypes.push({
              name,
              category: "FrameworkDefault",
            });
          }
        );
      }
    });
  }

  get reservedTypes() {
    return [...this.__allReservedTypes];
  }
}
