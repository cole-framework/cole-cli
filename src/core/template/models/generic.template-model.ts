import { GenericObject, InheritanceObject } from "../../components/schemas";
import { InheritanceTemplateModel } from "./inheritance.template-model";

export class GenericTemplateModel {
  static create(schema: GenericObject) {
    const { dflt, name, inheritance } = schema;
    return new GenericTemplateModel(
      name,
      dflt,
      inheritance ? InheritanceTemplateModel.create(inheritance) : null
    );
  }

  constructor(
    public name: string,
    public dflt: string,
    public inheritance: InheritanceTemplateModel
  ) {}
}
