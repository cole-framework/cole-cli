import { basename, dirname, extname, join, relative } from "path";
import {
  ComponentData,
  ExportData,
  ExportTemplateModel,
  FileOutput,
  FileTemplateModel,
  Result,
  Strategy,
  WriteMethod,
  fileOrDirExists,
} from "../core";
import { TypeScriptFileTemplate } from "./typescript.file-template";
import { TypeScriptFileReader } from "./typescript.file-reader";
import { TypeScriptFileModifier } from "./typescript.file-modifier";
import { ApiObject } from "../commands/api";

export class TypeScriptFileOutputStrategy extends Strategy {
  public async apply(
    models: FileTemplateModel[]
  ): Promise<Result<FileOutput[]>> {
    const outputs: FileOutput[] = [];
    try {
      for (const model of models) {
        if (fileOrDirExists(model.path)) {
          const file = TypeScriptFileReader.readFile(model.path);
          const modifier = new TypeScriptFileModifier(file);
          const output = modifier.modify(model);
          if (output) {
            outputs.push(output);
          }
        } else {
          const content = await TypeScriptFileTemplate.parse(model.content);
          const output = new FileOutput(
            model.path,
            model.write_method,
            content
          );
          outputs.push(output);
        }
      }

      return Result.withContent(outputs);
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}

export class TypeScriptTemplateModelStrategy extends Strategy {
  private updateTemplateModel(
    files: Map<string, FileTemplateModel>,
    data: ComponentData
  ) {
    let file = files.get(data.path);

    if (!file) {
      file = new FileTemplateModel(data.path, data.write_method);
      files.set(data.path, file);
    }
    file.update(data, this.config);
  }

  private addExport(exports: ExportData[], path: string, exp: ExportData) {
    if (exp) {
      const cExp = exports.find((e) => e.path === path);
      if (!cExp) {
        exports.push(
          ExportTemplateModel.create({
            ...exp,
            path,
          })
        );
      }
    }
  }

  public apply(api: ApiObject): Result<FileTemplateModel[]> {
    try {
      const templateModels = new Map<string, FileTemplateModel>();

      api.controllers.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.entities.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.mappers.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.models.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.repositories.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.repository_factories.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.repository_impls.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.route_ios.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.routes.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.sources.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.toolsets.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      api.use_cases.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );
      
      api.test_suites.forEach((item) =>
        this.updateTemplateModel(templateModels, item)
      );

      const models = Array.from(templateModels, ([, value]) => value);

      // create index.ts files
      const indexModelsByPath = new Map<string, ExportTemplateModel[]>();
      models.forEach((model) => {
        if (model.write_method === WriteMethod.Skip) {
          return;
        }

        const dir = dirname(model.path);
        const indexPath = join(dir, "index.ts");
        let temp = join(
          relative(dirname(indexPath), dirname(model.path)),
          basename(model.path).replace(extname(model.path), "")
        );

        const path = temp.startsWith(".") ? temp : `./${temp}`;

        let exports = indexModelsByPath.get(indexPath);

        if (!exports) {
          exports = [];
          indexModelsByPath.set(indexPath, exports);
        }

        model.content.classes.forEach((item) => {
          this.addExport(exports, path, item.exp);
        });

        model.content.types.forEach((item) => {
          this.addExport(exports, path, item.exp);
        });

        model.content.functions.forEach((item) => {
          this.addExport(exports, path, item.exp);
        });
      });

      const indexes = Array.from(
        indexModelsByPath,
        ([path, exports]) =>
          new FileTemplateModel(path, WriteMethod.Write, { exports })
      );

      return Result.withContent([...indexes, ...models]);
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
