import { ParamTemplateModel } from "../../../core";
import { ComponentTemplates } from "../components";

export const ARGUMENT_TEMPLATE = `_NAME__VALUE_`;

export class ArgumentTemplate {
  static parse(model: ParamTemplateModel): string {
    if (model.value) {
      return typeof model.value === "string"
        ? `"${model.value}"`
        : typeof model.value === "object"
          ? JSON.stringify(model.value, null, 2)
          : model.value;
    }
    return model.name;
  }
  // if (model.template) {
  //   return ComponentTemplates.get(model.template)(model);
  // }
  // let _NAME_ = "";
  // let _VALUE_ = "";
  // if (model.value) {
  //   _VALUE_ =
  //     typeof model.value === "string"
  //       ? `"${model.value}"`
  //       : typeof model.value === "object"
  //         ? JSON.stringify(model.value, null, 2)
  //         : model.value;
  // } else {
  //   _NAME_ = model.name;
  // }
  // return ARGUMENT_TEMPLATE.replace("_NAME_", _NAME_)
  //   .replace("_VALUE_", _VALUE_)
  //   .replace(/[ ]+/g, " ")
  //   .replace(/^(\s*\n\s*)+$/gm, "\n");
  // }
}
