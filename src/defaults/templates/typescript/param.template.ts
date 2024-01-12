import { ParamTemplateModel } from "../../../core";

export const PARAM_TEMPLATE = `_ACCESS__READONLY__NAME__OPTIONAL__TYPE__VALUE_`;

export class ParamTemplate {
  static parse(model: ParamTemplateModel): string {
    
    const _READONLY_ = model.is_readonly ? "readonly " : "";
    const _OPTIONAL_ = model.is_optional ? "?" : "";
    const _TYPE_ = model.type ? `: ${model.type}` : "";
    const _VALUE_ = model.value ? ` = ${model.value}` : "";

    return PARAM_TEMPLATE.replace("_ACCESS_", model.access || "")
      .replace("_READONLY_", _READONLY_)
      .replace("_NAME_", model.name)
      .replace("_OPTIONAL_", _OPTIONAL_)
      .replace("_TYPE_", _TYPE_)
      .replace("_VALUE_", _VALUE_);
  }
}
