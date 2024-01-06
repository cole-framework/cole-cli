import { DatabaseConfigData, DatabaseMapping } from "./database-config.types";

export class DatabaseConfig {
  public static create(data: DatabaseConfigData): DatabaseConfig {
    const mappings: DatabaseMapping[] = [];

    if (data.mappings) {
      data.mappings.forEach((m) => {
        mappings.push({ dbType: m.db_type, codeType: m.code_type });
      });
    }

    return new DatabaseConfig(data.name, data.alias, mappings);
  }

  constructor(
    public readonly name: string,
    public readonly alias: string,
    public readonly mappings: DatabaseMapping[]
  ) {}
}
