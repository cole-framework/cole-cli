import { MethodTemplateModel } from "../../../core";
import { ParamTemplate } from "./param.template";

export const METHOD_TEMPLATE = `_ACCESS__STATIC__ASYNC__NAME_(_PARAMS_)_RETURN_TYPE_ {
  _SUPER_
  _BODY_
}`;

export class MethodTemplate {
  static parse(model: MethodTemplateModel): string {
    const _ACCESS_ = model.access;
    const _ASYNC_ = model.is_async ? "async " : "";
    const _STATIC_ = model.is_async ? "static " : "";
    const _PARAMS_ = model.params.map((p) => ParamTemplate.parse(p)).join(", ");
    const _BODY_ = model.body;
    const _RETURN_TYPE_ = model.return_type ? `: ${model.return_type}` : "";
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

    return METHOD_TEMPLATE.replace("_ACCESS_", _ACCESS_)
      .replace("_STATIC_", _STATIC_)
      .replace("_ASYNC_", _ASYNC_)
      .replace("_NAME_", model.name)
      .replace("_PARAMS_", _PARAMS_)
      .replace("_RETURN_TYPE_", _RETURN_TYPE_)
      .replace("_SUPER_", _SUPER_)
      .replace("_BODY_", _BODY_);
  }
}
