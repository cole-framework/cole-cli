import { Dependency } from "../../components/component";
import { ClassObject, ExportObject } from "../../components/schemas";
import { Config } from "../../config";
import { ConstructorTemplateModel } from "./constructor.template-model";
import { GenericTemplateModel } from "./generic.template-model";
import { ImportTemplateModel } from "./import.template-model";
import { InheritanceTemplateModel } from "./inheritance.template-model";
import { InterfaceTemplateModel } from "./interface.template-model";
import { MethodTemplateModel } from "./method.template-model";
import { PropTemplateModel } from "./prop.template-model";

export class ClassTemplateModel {
  static create(
    schema: ClassObject,
    dependencies: Dependency[],
    config: Config
  ) {
    const {
      exp,
      ctor,
      interfaces,
      inheritance,
      props,
      methods,
      generics,
      imports,
      name,
      is_abstract,
    } = schema;

    return new ClassTemplateModel(
      is_abstract,
      name,
      exp,
      ctor ? ConstructorTemplateModel.create(ctor, dependencies, config) : null,
      Array.isArray(interfaces)
        ? interfaces.map((i) =>
            InterfaceTemplateModel.create(i, dependencies, config)
          )
        : [],
      Array.isArray(inheritance)
        ? inheritance.map((i) => InheritanceTemplateModel.create(i))
        : [],
      Array.isArray(props)
        ? props.map((i) => PropTemplateModel.create(i, dependencies, config))
        : [],
      Array.isArray(methods)
        ? methods.map((i) =>
            MethodTemplateModel.create(i, dependencies, config)
          )
        : [],
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : []
    );
  }

  constructor(
    public isAbstract: boolean,
    public name: string,
    public exp: ExportObject,
    public ctor: ConstructorTemplateModel,
    public interfaces: InterfaceTemplateModel[],
    public inheritance: InheritanceTemplateModel[],
    public props: PropTemplateModel[],
    public methods: MethodTemplateModel[],
    public generics: GenericTemplateModel[],
    public imports: ImportTemplateModel[]
  ) {}
}
