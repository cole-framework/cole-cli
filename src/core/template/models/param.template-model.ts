import { Dependency } from "../../components/component";
import { ParamObject } from "../../components/schemas";
import { Config } from "../../config";
import { TemplateModelTools } from "../template-model.tools";

export class ParamTemplateModel {
  static create(
    schema: ParamObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const { access, name, type, is_optional, is_readonly, value } = schema;

    return new ParamTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(type, dependencies, config),
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
