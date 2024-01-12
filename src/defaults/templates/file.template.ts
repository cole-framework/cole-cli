import { FileTemplateModel } from "../../core/template/file.template-model";
import { ClassTemplate } from "./typescript/class.template";
import { FunctionTemplate } from "./typescript/function.template";
import { ImportTemplate } from "./typescript/import.template";
import { TypeTemplate } from "./typescript/type.template";

export const FILE_TEMPLATE = `
_IMPORTS_
_TYPES_
_FUNCTIONS_
_CLASSES_
`;

export class FileTemplate {
  static parse(model: FileTemplateModel) {
    const {
      content: { imports, classes, types, functions },
    } = model;

    const _IMPORTS_ = imports.map((i) => ImportTemplate.parse(i)).join(`
`);
    const _TYPES_ = types.map((i) => TypeTemplate.parse(i)).join(`
`);
    const _FUNCTIONS_ = functions.map((i) => FunctionTemplate.parse(i)).join(`
`);
    const _CLASSES_ = classes.map((i) => ClassTemplate.parse(i)).join(`
`);

    return FILE_TEMPLATE.replace("_IMPORTS_", _IMPORTS_)
      .replace("_TYPES_", _TYPES_)
      .replace("_FUNCTIONS_", _FUNCTIONS_)
      .replace("_CLASSES_", _CLASSES_);
  }
}
