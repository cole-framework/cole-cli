import { Dependency } from "../../components/component";
import { ConstructorObject } from "../../components/schemas";
import { Config } from "../../config";
import { ParamTemplateModel } from "./param.template-model";

export class ConstructorTemplateModel {
  static create(
    schema: ConstructorObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const { access, params, body, supr } = schema;

    return new ConstructorTemplateModel(
      access,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p, dependencies, config))
        : [],
      body,
      supr ? ConstructorTemplateModel.create(supr, dependencies, config) : null
    );
  }

  constructor(
    public access: string,
    public params: ParamTemplateModel[],
    public body: any,
    public supr: ConstructorTemplateModel
  ) {}
}
