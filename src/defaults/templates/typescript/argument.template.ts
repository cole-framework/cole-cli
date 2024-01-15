import { ParamTemplateModel } from "../../../core";

export const ARGUMENT_TEMPLATE = `_NAME__VALUE_`;

export class ArgumentTemplate {
  static parse(model: ParamTemplateModel): string {
    let _NAME_ = "";
    let _VALUE_ = "";

    if (model.value) {
      _VALUE_ =
        typeof model.value === "string" ? `"${model.value}"` : model.value;
    } else {
      _NAME_ = model.name;
    }

    return ARGUMENT_TEMPLATE.replace("_NAME_", _NAME_)
      .replace("_VALUE_", _VALUE_)
      .replace(/[ ]+/g, " ")
      .replace(/^(\s*\n\s*)+$/gm, "\n");
  }
}
