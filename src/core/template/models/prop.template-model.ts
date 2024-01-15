import { Dependency } from "../../components/component";
import { PropObject } from "../../components/schemas";

export class PropTemplateModel {
  static create(schema: PropObject, dependencies: Dependency[]) {
    const { access, name, type, is_optional, is_readonly, is_static, value } =
      schema;
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
    }

    return new PropTemplateModel(
      access,
      name,
      t,
      is_optional,
      is_readonly,
      is_static,
      value
    );
  }

  constructor(
    public access: string,
    public name: string,
    public type: string,
    public is_optional: boolean,
    public is_readonly: boolean,
    public is_static: boolean,
    public value: any
  ) {}
}
