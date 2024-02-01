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
    const { access, name, type, is_optional, is_readonly, value, template } =
      schema;

    return new ParamTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(type),
      is_optional,
      is_readonly,
      value,
      template
    );
  }

  constructor(
    public access: string,
    public name: string,
    public type: string,
    public is_optional: boolean,
    public is_readonly: boolean,
    public value: any,
    public template: any
  ) {}
}
