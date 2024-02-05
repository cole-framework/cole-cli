import { DatabaseConfigData, DatabaseMapping } from "./database-config.types";

export class DatabaseConfig {
  public static create(data: DatabaseConfigData): DatabaseConfig {
    const mappings: DatabaseMapping[] = [];

    if (data.mappings) {
      data.mappings.forEach((m) => {
        mappings.push({ dbType: m.db_type, codeType: m.code_type });
      });
    }

    return new DatabaseConfig(
      data.name,
      data.alias,
      data.case_style,
      mappings,
      data.module,
      data.package
    );
  }

  constructor(
    public readonly name: string,
    public readonly alias: string,
    public readonly caseStyle: string,
    public readonly mappings: DatabaseMapping[],
    public readonly module: string,
    public readonly pckg: string
  ) {}
}
