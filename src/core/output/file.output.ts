import prettier from "prettier";
import {
  FileTemplateContent,
  FileTemplateModel,
} from "../template/file.template-model";
import { ClassTemplate } from "../../defaults/templates/typescript/class.template";
import { FunctionTemplate } from "../../defaults/templates/typescript/function.template";
import { ImportTemplate } from "../../defaults/templates/typescript/import.template";
import { TypeTemplate } from "../../defaults/templates/typescript/type.template";

export const FILE_TEMPLATE = `
_IMPORTS_
_TYPES_
_FUNCTIONS_
_CLASSES_
`;

export class FileTemplate {
  static async parse(content: FileTemplateContent, format: string) {
    const { imports, classes, types, functions } = content;

    const _IMPORTS_ = imports.map((i) => ImportTemplate.parse(i)).join(`
`);
    const _TYPES_ = types.map((i) => TypeTemplate.parse(i)).join(`
`);
    const _FUNCTIONS_ = functions.map((i) => FunctionTemplate.parse(i)).join(`
`);
    const _CLASSES_ = classes.map((i) => ClassTemplate.parse(i)).join(`
`);

    const code = FILE_TEMPLATE.replace("_IMPORTS_", _IMPORTS_)
      .replace("_TYPES_", _TYPES_)
      .replace("_FUNCTIONS_", _FUNCTIONS_)
      .replace("_CLASSES_", _CLASSES_)
      .replace(/[ ]+/g, " ")
      .replace(/^(\s*\n\s*)+$/gm, "");

    return prettier.format(code, { parser: format });
  }
}

export class FileOutput {
  static async create(model: FileTemplateModel) {
    const content = await FileTemplate.parse(model.content, model.format);
    return new FileOutput(model.path, model.wite_method, content);
  }

  private constructor(
    public readonly path: string,
    public readonly wite_method: string,
    public readonly content: string
  ) {}
}
