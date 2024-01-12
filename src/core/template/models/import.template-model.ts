import { ImportObject } from "../../components/schemas";

export class ImportTemplateModel {
  static create(schema: ImportObject) {
    const { dflt, path, list, alias } = schema;
    return new ImportTemplateModel(dflt, path, list || [], alias);
  }

  constructor(
    public dflt: string,
    public path: string,
    public list: string[],
    public alias: string
  ) {}
}
