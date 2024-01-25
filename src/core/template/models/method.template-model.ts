import { Dependency } from "../../components/component";
import { MethodObject } from "../../components/schemas";
import { Config } from "../../config";
import { TemplateModelTools } from "../template-model.tools";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class MethodTemplateModel {
  static create(
    schema: MethodObject,
    dependencies: Dependency[],
    config: Config
  ) {
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

    return new MethodTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(
        return_type,
        dependencies,
        config
      ),
      is_async,
      is_static,
      params.map((p) => ParamTemplateModel.create(p, dependencies, config)),
      body,
      supr ? MethodTemplateModel.create(supr, dependencies, config) : null,
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
