import { Dependency } from "../../components/component";
import {
  GenericObject,
  FunctionObject,
  ExportObject,
} from "../../components/schemas";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class FunctionTemplateModel {
  static create(schema: FunctionObject, dependencies: Dependency[]) {
    const { name, is_async, return_type, generics, params, body, exp } = schema;
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

    return new FunctionTemplateModel(
      exp,
      name,
      t,
      is_async,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p, dependencies))
        : [],
      body,
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : []
    );
  }

  constructor(
    public exp: ExportObject,
    public name: string,
    public return_type: string,
    public is_async: boolean,
    public params: ParamTemplateModel[],
    public body: any,
    public generics: GenericTemplateModel[]
  ) {}
}
