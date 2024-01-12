import { Dependency } from "../../components/component";
import {
  ExportObject,
  GenericObject,
  InheritanceObject,
  InterfaceObject,
} from "../../components/schemas";
import { ImportTemplateModel } from "./import.template-model";
import { MethodTemplateModel } from "./method.template-model";
import { PropTemplateModel } from "./prop.template-model";

export class InterfaceTemplateModel {
  static create(schema: InterfaceObject, dependencies: Dependency[]) {
    const { exp, inheritance, props, methods, generics, name, imports } =
      schema;

    return new InterfaceTemplateModel(
      name,
      exp,
      inheritance,
      Array.isArray(props)
        ? props.map((i) => PropTemplateModel.create(i, dependencies))
        : [],
      Array.isArray(methods)
        ? methods.map((i) => MethodTemplateModel.create(i, dependencies))
        : [],
      generics,
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : []
    );
  }

  constructor(
    public name: string,
    public exp: ExportObject,
    public inheritance: InheritanceObject[],
    public props: PropTemplateModel[],
    public methods: MethodTemplateModel[],
    public generics: GenericObject[],
    public imports: ImportTemplateModel[]
  ) {}
}
