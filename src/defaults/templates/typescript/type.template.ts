import { TypeTemplateModel } from "../../../core";
import { GenericTemplate } from "./generic.template";
import { ParamTemplate } from "./param.template";

export const TYPE_TEMPLATE = `_EXPORT_type _NAME__GENERICS = {
  _PROPS_
}`;
export const ALIAS_TEMPLATE = `_EXPORT_type _NAME__GENERICS = _ALIAS_`;

export class TypeTemplate {
  static parse(model: TypeTemplateModel): string {
    const _NAME_ = model.name;
    const _GENERICS_ =
      model.generics.length > 0
        ? `<${model.generics.map((p) => GenericTemplate.parse(p)).join(", ")}>`
        : "";
    const _EXPORT_ = model.exp
      ? model.exp.is_default
        ? "export default "
        : "export "
      : "";

    if (model.alias) {
      const _ALIAS_ = model.alias || "";
      return ALIAS_TEMPLATE.replace("_EXPORT_", _EXPORT_)
        .replace("_NAME_", _NAME_)
        .replace("_GENERICS_", _GENERICS_)
        .replace("_ALIAS_", _ALIAS_);
    }

    const _PROPS_ = model.props.map((p) => ParamTemplate.parse(p)).join(`,
    `);

    return TYPE_TEMPLATE.replace("_EXPORT_", _EXPORT_)
      .replace("_NAME_", _NAME_)
      .replace("_PROPS_", _PROPS_)
      .replace("_GENERICS_", _GENERICS_)
      .replace("_PROPS_", _PROPS_);
  }
}
