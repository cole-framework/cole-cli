import { Dependency } from "../../components/component";
import { MethodObject } from "../../components/schemas";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class MethodTemplateModel {
  static create(schema: MethodObject, dependencies: Dependency[]) {
    const {
      access,
      name,
      is_async,
      is_static,
      return_type,
      generics,
      params,
      body,
      supr,
    } = schema;
    let t = "unknown";

    if (return_type && return_type.isComponentType) {
      const dependency = dependencies.find(
        (d) =>
          d.type.name === return_type.name &&
          d.type.type === return_type.type &&
          d.type.component === return_type.component
      );
      if (dependency) {
        t = dependency.name;
      }
    } else if (
      return_type &&
      (return_type.isPrimitive ||
        return_type.isDatabaseType ||
        return_type.isFrameworkDefault)
    ) {
      t = return_type.name;
    }

    return new MethodTemplateModel(
      access,
      name,
      t,
      is_async,
      is_static,
      params.map((p) => ParamTemplateModel.create(p, dependencies)),
      body,
      supr ? MethodTemplateModel.create(supr, dependencies) : null,
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : []
    );
  }

  constructor(
    public access: string,
    public name: string,
    public return_type: string,
    public is_async: boolean,
    public is_static: boolean,
    public params: ParamTemplateModel[],
    public body: any,
    public supr: MethodTemplateModel,
    public generics: GenericTemplateModel[]
  ) {}
}
