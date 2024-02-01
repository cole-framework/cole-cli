import { isMainThread, parentPort, threadId } from "worker_threads";
import { FileTemplateModel, SourceCodeWriter } from "./";
import { FileTransport } from "./transport/file.transport";
import { ConsoleTransport } from "./transport/console.transport";
import { TypeScriptFileTemplate } from "../defaults/typescript.file-template";
import { TypeScriptFileOutputStrategy } from "../defaults/typescript.strategy";

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
  // const codeModule = require(code_module);
  const strategy = new TypeScriptFileOutputStrategy(null);
  const { content: outputs, failure } = await strategy.apply(models);

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
