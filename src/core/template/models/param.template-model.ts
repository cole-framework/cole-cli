import { Dependency } from "../../components/component";
import { ParamObject } from "../../components/schemas";

export class ParamTemplateModel {
  static create(schema: ParamObject, dependencies: Dependency[]) {
    const { access, name, type, is_optional, is_readonly, value } = schema;
    let t = "any";

    if (type && type.isComponentType) {
      const dependency = dependencies.find(
        (d) =>
          d.type.name === type.name &&
          d.type.type === type.type &&
          d.type.component === type.component
      );
      if (dependency) {
        t = dependency.name;
      }
    } else if (
      type &&
      (type.isPrimitive || type.isDatabaseType || type.isFrameworkDefaultType)
    ) {
      t = type.name;
    } else if (typeof type === "string") {
      t = type;
    }

    return new ParamTemplateModel(
      access,
      name,
      t,
      is_optional,
      is_readonly,
      value
    );
  }

  constructor(
    public access: string,
    public name: string,
    public type: string,
    public is_optional: boolean,
    public is_readonly: boolean,
    public value: any
  ) {}
}
