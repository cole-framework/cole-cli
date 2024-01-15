import { Transport } from "../../../transport/transport";
import {
  ComponentData,
  Config,
  FileOutput,
  Result,
  WorkerPool,
} from "../../../core";
import { ApiObject } from "./api.types";
import { FileTemplateModel } from "../../../core/template/file.template-model";
import { ApiSchema } from "./api.schema";
import { COMPILER_WORKER_PATH } from "./worker";

export const updateTemplateModel = (
  files: Map<string, FileTemplateModel>,
  data: ComponentData,
  code: string
) => {
  let file = files.get(data.path);

  if (!file) {
    file = new FileTemplateModel(data.path, data.write_method, code);
    files.set(data.path, file);
  }
  file.update(data);
};

export class ApiGenerator {
  constructor(
    protected config: Config
  ) {}

  protected createTemplateModels(api: ApiObject) {
    const {
      config: { code },
    } = this;
    const templateModels = new Map<string, FileTemplateModel>();

    api.controllers.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.entities.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.mappers.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.models.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.repositories.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.repository_factories.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.repository_impls.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.route_ios.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.routes.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.sources.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.tools.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );
    api.use_cases.forEach((item) =>
      updateTemplateModel(templateModels, item, code.alias)
    );

    return Array.from(templateModels, ([, value]) => value);
  }

  public async generate(api: ApiSchema): Promise<Result> {
    const obj = api.toObject();
    const models = this.createTemplateModels(obj);

    // console.log("OBJ:", JSON.stringify(obj, null, 2));
    console.log('MODELS:', JSON.stringify(models, null, 2));

    const promises = [];
    const {
      compilation: { threadCount, batchSize },
    } = this.config;
    const operationsCount = Math.ceil(models.length / batchSize);
    const usefulThreadCount =
      operationsCount < threadCount ? operationsCount : threadCount;
    const workerPool = new WorkerPool(COMPILER_WORKER_PATH, usefulThreadCount);

    // workerPool.setTaskCompleteCallback(() => { });
    // workerPool.setTaskErrorCallback(() => { });

    for (let i = 0; i < models.length; i += batchSize) {
      const batch = models.slice(i, i + batchSize);
      promises.push(workerPool.executeTask(batch));
    }

    try {
      await Promise.all(promises);
      console.log("Done");
    } catch (error) {
      console.error(error);
    } finally {
      workerPool.shutdown();
    }

    return Result.withoutContent();
  }
}
