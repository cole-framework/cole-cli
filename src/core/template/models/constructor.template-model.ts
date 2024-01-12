import { Dependency } from "../../components/component";
import { ConstructorObject } from "../../components/schemas";
import { ParamTemplateModel } from "./param.template-model";

export class ConstructorTemplateModel {
  static create(schema: ConstructorObject, dependencies: Dependency[]) {
    const { access, params, body, supr } = schema;

    return new ConstructorTemplateModel(
      access,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p, dependencies))
        : [],
      body,
      supr ? ConstructorTemplateModel.create(supr, dependencies) : null
    );
  }

  constructor(
    public access: string,
    public params: ParamTemplateModel[],
    public body: any,
    public supr: ConstructorTemplateModel
  ) {}
}
