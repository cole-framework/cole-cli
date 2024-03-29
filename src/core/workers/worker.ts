import { isMainThread, parentPort } from "worker_threads";
import { SourceCodeWriter } from "./source-code-writer";
import { FileTransport } from "../transport/file.transport";
import { ConsoleTransport } from "../transport/console.transport";
import {
  FileTemplateModel,
  LanguageStrategyProvider,
} from "@cole-framework/cole-cli-core";

export const COMPILER_WORKER_PATH = __filename;

export type Payload = {
  transport: string;
  code_module: string;
  models: FileTemplateModel[];
};

const writeFiles = async (payload: Payload) => {
  const { models, code_module } = payload;
  const transport =
    payload.transport === "file" ? new FileTransport() : new ConsoleTransport();

  const codeWriter = new SourceCodeWriter(transport);
  const languageModule: LanguageStrategyProvider = require(code_module);

  const { content: outputs, failure } = await languageModule
    .createFileOutputStrategy()
    .apply(models);

  if (failure) {
    parentPort.postMessage({ status: "error", error: failure.error });
  } else {
    codeWriter.add(outputs);

    const { error, state } = codeWriter.write();

    if (error) {
      parentPort.postMessage({ status: "error", error });
    } else {
      parentPort.postMessage({ status: "complete", state });
    }
  }
};

if (isMainThread === false) {
  parentPort.on("message", (payload: Payload) => {
    writeFiles(payload);
  });
}
