import prettier from "prettier";
import { FileTemplateContent } from "../core";
import {
  ClassTemplate,
  FunctionTemplate,
  ImportTemplate,
  TypeTemplate,
} from "./templates";

export const FILE_TEMPLATE = `
_IMPORTS_
_TYPES_
_FUNCTIONS_
_CLASSES_
`;

export class TypeScriptFileTemplate {
  static async parse(content: FileTemplateContent) {
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

    return prettier.format(code, { parser: 'typescript' });
  }
}
