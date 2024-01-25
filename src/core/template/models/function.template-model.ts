import { Dependency } from "../../components/component";
import {
  GenericObject,
  FunctionObject,
  ExportObject,
} from "../../components/schemas";
import { Config } from "../../config";
import { TemplateModelTools } from "../template-model.tools";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class FunctionTemplateModel {
  static create(
    schema: FunctionObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const { name, is_async, return_type, generics, params, body, exp } = schema;

    return new FunctionTemplateModel(
      exp,
      name,
      TemplateModelTools.generateNameFromType(
        return_type,
        dependencies,
        config
      ),
      is_async,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p, dependencies, config))
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
