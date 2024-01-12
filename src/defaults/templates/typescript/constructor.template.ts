import { ConstructorTemplateModel } from "../../../core";
import { ParamTemplate } from "./param.template";

export const CONSTRUCTOR_TEMPLATE = `_ACCESS_constructor(_PARAMS_) {
  _SUPER_
  _BODY_
}`;

export class ConstructorTemplate {
  static parse(model: ConstructorTemplateModel): string {
    const _ACCESS_ = model.access;
    const _PARAMS_ = model.params.map((p) => ParamTemplate.parse(p)).join(", ");
    const _BODY_ = model.body;
    let _SUPER_ = "";

    if (model.supr) {
      if (model.supr.params.length > 0) {
        _SUPER_ = `super(${model.params
          .map((p) => ParamTemplate.parse(p))
          .join(", ")});`;
      } else {
        _SUPER_ = "super();";
      }
    }

    return CONSTRUCTOR_TEMPLATE.replace("_ACCESS_", _ACCESS_)
      .replace("_PARAMS_", _PARAMS_)
      .replace("_SUPER_", _SUPER_)
      .replace("_BODY_", _BODY_);
  }
}
