import { InheritanceTemplateModel } from "../../../core";
import { GenericTemplate } from "./generic.template";

export const INHERITANCE_TEMPLATE = `_NAME__GENERICS_`;

export class InheritanceTemplate {
  static parse(model: InheritanceTemplateModel): string {
    const { name, generics } = model;

    const _GENERICS_ =
      generics.length > 0
        ? `<${generics.map((g) => GenericTemplate.parse(g)).join(", ")}>`
        : "";

    return INHERITANCE_TEMPLATE.replace("_NAME_", name).replace(
      "_GENERICS_",
      _GENERICS_
    );
  }
}
