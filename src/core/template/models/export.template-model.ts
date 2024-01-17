import { ExportObject } from "../../components/schemas";

export class ExportTemplateModel {
  static create(schema: ExportObject) {
    const { is_default, use_wildcard, path, list, alias } = schema;
    return new ExportTemplateModel(
      is_default,
      use_wildcard,
      path,
      list || [],
      alias
    );
  }

  constructor(
    public is_default: boolean,
    public use_wildcard: boolean,
    public path: string,
    public list: string[],
    public alias: string
  ) {}
}
