import { ImportTemplateModel } from "../../../core";

export const IMPORT_TEMPLATE = `import _IMPORT_ from "_PATH_";`;

export class ImportTemplate {
  static parse(model: ImportTemplateModel): string {
    let _IMPORT_;
    if (model.alias) {
      _IMPORT_ = `* as ${model.alias}`;
    } else {
      let parts = [];

      if (model.dflt) {
        parts.push(model.dflt);
      }

      if (Array.isArray(model.list) && model.list.length > 0) {
        parts.push(`{ ${model.list.join(", ")} }`);
      }

      _IMPORT_ = parts.join(", ");
    }

    return IMPORT_TEMPLATE.replace("_IMPORT_", _IMPORT_).replace(
      "_PATH_",
      model.path
    );
  }
}
