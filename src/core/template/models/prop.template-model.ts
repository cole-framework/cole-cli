import { Dependency } from "../../components/component";
import { PropObject } from "../../components/schemas";
import { Config } from "../../config";
import { TemplateModelTools } from "../template-model.tools";

export class PropTemplateModel {
  static create(
    schema: PropObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const { access, name, type, is_optional, is_readonly, is_static, value, template } =
      schema;

    return new PropTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(type),
      is_optional,
      is_readonly,
      is_static,
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
    public is_static: boolean,
    public value: any,
    public template: any
  ) {}
}
