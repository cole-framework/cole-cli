import { CodeConfig } from "./code-config";
import { CompilationConfig } from "./CompilationConfig";
import { ComponentsConfig } from "./components-config";
import { ComponentsConfigTools } from "./components-config.tools";
import { ConfigData, ReservedType } from "./config.types";
import { DatabaseConfig } from "./database-config";
import { GeneralConfig } from "./general-config";

export class Config {
  public static create(data: ConfigData): Config {
    const general = GeneralConfig.create(data.general);
    const compilation = CompilationConfig.create(data.compilation);
    const databases = data.databases.map(DatabaseConfig.create);
    const code = CodeConfig.create(data.code);
    const components = ComponentsConfig.create(
      data.compilation.source_dirname,
      data.components
    );

    return new Config(general, compilation, databases, code, components);
  }

  private __allReservedTypes: ReservedType[] = [];

  constructor(
    public readonly general: GeneralConfig,
    public readonly compilation: CompilationConfig,
    public readonly databases: DatabaseConfig[],
    public readonly code: CodeConfig,
    public readonly components: ComponentsConfig
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
