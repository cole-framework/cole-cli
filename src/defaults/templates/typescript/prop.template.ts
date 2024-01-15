import { PropTemplateModel } from "../../../core";

export const PROP_TEMPLATE = `_ACCESS_ _STATIC_ _READONLY_ _NAME__OPTIONAL_ _TYPE_ _VALUE_;`;

export class PropTemplate {
  static parse(model: PropTemplateModel): string {
    const _ACCESS_ = model.access || "";
    const _READONLY_ = model.is_readonly ? "readonly " : "";
    const _STATIC_ = model.is_static ? "static " : "";
    const _OPTIONAL_ = model.is_optional ? "?" : "";
    const _TYPE_ = model.type ? `: ${model.type}` : "";
    const _VALUE_ = model.value ? ` = ${model.value}` : "";

    return PROP_TEMPLATE.replace("_ACCESS_", _ACCESS_)
      .replace("_STATIC_", _STATIC_)
      .replace("_READONLY_", _READONLY_)
      .replace("_NAME_", model.name)
      .replace("_OPTIONAL_", _OPTIONAL_)
      .replace("_TYPE_", _TYPE_)
      .replace("_VALUE_", _VALUE_)
      .replace(/[ ]+/g, " ")
      .replace(/^(\s*\n\s*)+$/gm, "\n");
  }
}
