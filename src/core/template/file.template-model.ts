import { ComponentData } from "../components";
import {
  ClassTemplateModel,
  ExportTemplateModel,
  FunctionTemplateModel,
  ImportTemplateModel,
  MethodTemplateModel,
  ParamTemplateModel,
  PropTemplateModel,
  TypeTemplateModel,
} from "./models";

export type FileTemplateContent = {
  exports: ExportTemplateModel[];
  imports: ImportTemplateModel[];
  types: TypeTemplateModel[];
  functions: FunctionTemplateModel[];
  classes: ClassTemplateModel[];
};

export class FileTemplateModel {
  public readonly content: FileTemplateContent = {
    exports: [],
    imports: [],
    types: [],
    functions: [],
    classes: [],
  };

  constructor(
    public readonly path: string,
    public readonly write_method: string,
    content?: {
      exports?: ExportTemplateModel[];
      imports?: ImportTemplateModel[];
      types?: TypeTemplateModel[];
      functions?: FunctionTemplateModel[];
      classes?: ClassTemplateModel[];
    }
  ) {
    if (content) {
      this.content.classes = content.classes || [];
      this.content.functions = content.functions || [];
      this.content.types = content.types || [];
      this.content.imports = content.imports || [];
      this.content.exports = content.exports || [];
    }
  }

  update(data: ComponentData) {
    const {
      content: { imports, types, functions, classes },
    } = this;

    if (Array.isArray(data.element.imports)) {
      data.element.imports.forEach((newImport) => {
        const impt = imports.find((imp) => imp.path === newImport.path);
        if (impt) {
          newImport.list.forEach((item) => {
            if (impt.list.indexOf(item) === -1) {
              impt.list.push(item);
            }
          });

          if (newImport.alias) {
            impt.alias = newImport.alias;
          }

          if (newImport.dflt) {
            impt.dflt = newImport.dflt;
          }
        } else {
          imports.push(ImportTemplateModel.create(newImport));
        }
      });
    }

    if (Array.isArray(data.dependencies)) {
      data.dependencies.forEach((dependency) => {
        if (dependency.path !== data.path) {
          // add import
        }
      });
    }

    if (Array.isArray(data.element.functions)) {
      data.element.functions.forEach((newFn) => {
        const fn = functions.find((f) => f.name === newFn.name);

        if (fn) {
          newFn.params.forEach((item) => {
            if (
              fn.params.findIndex((param) => param.name === item.name) === -1
            ) {
              fn.params.push(
                ParamTemplateModel.create(item, data.dependencies)
              );
            }
          });
        } else {
          functions.push(
            FunctionTemplateModel.create(newFn, data.dependencies)
          );
        }
      });
    }

    if (data.type.isModel || data.type.isRouteModel) {
      const type = types.find((i) => i.name === data.element.name);

      if (type) {
        data.element.props.forEach((item) => {
          if (type.props.findIndex((prop) => prop.name === item.name) === -1) {
            type.props.push(PropTemplateModel.create(item, data.dependencies));
          }
        });
      } else {
        types.push(TypeTemplateModel.create(data.element, data.dependencies));
      }
    }

    if (
      data.type.isComponentType &&
      !data.type.isModel &&
      !data.type.isRouteModel
    ) {
      const cls = classes.find((i) => i.name === data.element.name);

      if (cls) {
        data.element.props.forEach((item) => {
          if (cls.props.findIndex((prop) => prop.name === item.name) === -1) {
            cls.props.push(PropTemplateModel.create(item, data.dependencies));
          }
        });
        data.element.methods.forEach((item) => {
          if (cls.methods.findIndex((mth) => mth.name === item.name) === -1) {
            cls.methods.push(
              MethodTemplateModel.create(item, data.dependencies)
            );
          }
        });
      } else {
        classes.push(
          ClassTemplateModel.create(data.element, data.dependencies)
        );
      }
    }
  }
}
