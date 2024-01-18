import {
  Config,
  FileTemplateModel,
  Result,
  Strategy,
  WorkerPool,
} from "../../../core";
import { ApiSchema } from "./api.schema";
import { COMPILER_WORKER_PATH } from "../../../core/worker";
import { TypeScriptTemplateModelStrategy } from "../../../defaults/typescript.strategy";
import Logger from "../../../core/tools/logger";

const logger = Logger.getLogger();
export class ApiGenerator {
  private modelsStrategy: Strategy<FileTemplateModel[]>;
  private templatesStrategy: Strategy;
  constructor(protected config: Config) {}

  public async generate(api: ApiSchema): Promise<Result> {
    const { config, modelsStrategy, templatesStrategy } = this;
    const obj = api.toObject();
    // const codeModule = require(config.code.module);
    const { content: models, failure } = new TypeScriptTemplateModelStrategy(
      config
    ).apply(obj);

    if (failure) {
      return Result.withFailure(failure);
    }

    // console.log("MODELS:", JSON.stringify(models, null, 2));

    const promises = [];
    const {
      compilation: { threadCount, batchSize },
    } = this.config;
    const operationsCount = Math.ceil(models.length / batchSize);
    const usefulThreadCount =
      operationsCount < threadCount ? operationsCount : threadCount;
    const workerPool = new WorkerPool(COMPILER_WORKER_PATH, usefulThreadCount);

    workerPool.setTaskCompleteCallback((data) => {
      if (Array.isArray(data?.state)) {
        data.state.forEach((s) => {
          logger.info(
            `${s.status} ${s.path}`,
            s.status === "skipped"
              ? `🔵`
              : s.status === "created"
                ? `🟢`
                : s.status === "modified"
                  ? `🟠`
                  : `🔴`
          );
        });
      }
    });

    for (let i = 0; i < models.length; i += batchSize) {
      const batch = models.slice(i, i + batchSize);
      promises.push(
        workerPool.executeTask({
          code_module: config.code.module,
          transport: config.compilation.transport,
          models: batch,
        })
      );
    }

    try {
      await Promise.all(promises);
      workerPool.shutdown();
      return Result.withoutContent();
    } catch (error) {
      workerPool.shutdown();
      return Result.withFailure(error);
    }
  }
}
