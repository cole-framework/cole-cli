import { GenericTemplateModel } from "../../../core";

export const GENERIC_TEMPLATE = `_NAME__INHERITANCE__DEFAULT_`;

export class GenericTemplate {
  static parse(model: GenericTemplateModel): string {
    const { name, dflt, inheritance } = model;
    const _DEFAULT_ = dflt || "";
    const _INHERITANCE_ = inheritance ? ` extends ${inheritance.name}` : "";

    return GENERIC_TEMPLATE.replace("_NAME_", name)
      .replace("_INHERITANCE_", _INHERITANCE_)
      .replace("_DEFAULT_", _DEFAULT_);
  }
}
