import { Dependency } from "../../components/component";
import {
  GenericObject,
  FunctionObject,
  ExportObject,
} from "../../components/schemas";
import { Config } from "../../config";
import { TemplateModelTools } from "../template-model.tools";
import { BodyTemplateModel } from "./body.template-model";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class FunctionTemplateModel {
  static create(
    schema: FunctionObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const {
      name,
      is_async,
      return_type,
      generics,
      params,
      body,
      exp,
      template,
    } = schema;

    return new FunctionTemplateModel(
      exp,
      name,
      TemplateModelTools.generateNameFromType(return_type),
      is_async,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p, dependencies, config))
        : [],
      BodyTemplateModel.create(body),
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      template
    );
  }

  constructor(
    public exp: ExportObject,
    public name: string,
    public return_type: string,
    public is_async: boolean,
    public params: ParamTemplateModel[],
    public body: BodyTemplateModel,
    public generics: GenericTemplateModel[],
    public template: string
  ) {}
}
