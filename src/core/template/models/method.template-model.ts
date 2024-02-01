import { Dependency } from "../../components/component";
import { MethodObject } from "../../components/schemas";
import { Config } from "../../config";
import { TemplateModelTools } from "../template-model.tools";
import { BodyTemplateModel } from "./body.template-model";
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
      template,
    } = schema;

    return new MethodTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(return_type),
      is_async,
      is_static,
      params.map((p) => ParamTemplateModel.create(p, dependencies, config)),
      BodyTemplateModel.create(body),
      supr ? MethodTemplateModel.create(supr, dependencies, config) : null,
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      template
    );
  }

  constructor(
    public access: string,
    public name: string,
    public return_type: string,
    public is_async: boolean,
    public is_static: boolean,
    public params: ParamTemplateModel[],
    public body: BodyTemplateModel,
    public supr: MethodTemplateModel,
    public generics: GenericTemplateModel[],
    public template: string
  ) {}
}
