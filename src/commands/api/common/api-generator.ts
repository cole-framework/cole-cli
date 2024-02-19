import {
  LanguageStrategyProvider,
  Result,
} from "@cole-framework/cole-cli-core";
import { ApiSchema } from "./api.schema";
import { COMPILER_WORKER_PATH } from "../../../core/workers/worker";
import { Config, WorkerPool } from "../../../core";

export class ApiGenerator {
  constructor(
    protected config: Config,
    protected cliPluginPackageName: string
  ) {}

  public async generate(api: ApiSchema): Promise<Result> {
    const { config, cliPluginPackageName } = this;
    const obj = api.toObject();
    const languageModule: LanguageStrategyProvider = require(
      cliPluginPackageName
    );
    const { content: models, failure } = languageModule
      .createTemplateModelStrategy()
      .apply(obj, config.project);

    if (failure) {
      return Result.withFailure(failure);
    }
    // console.log("OBJ:", JSON.stringify(obj, null, 2));
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
          console.info(
            `${s.status} ${s.path}`,
            s.status === "skipped"
              ? `🔵`
              : s.status === "blank"
                ? `⚪`
                : s.status === "created"
                  ? `🟢`
                  : s.status === "modified"
                    ? `🟠`
                    : `🔴`
          );
        });
      }
    });

    // workerPool.setTaskErrorCallback((error) => {
    //   console.log(error);
    // });

    for (let i = 0; i < models.length; i += batchSize) {
      const batch = models.slice(i, i + batchSize);
      promises.push(
        workerPool.executeTask({
          code_module: cliPluginPackageName,
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
