import { isMainThread, parentPort } from "worker_threads";
import {
  FileOutput,
  FileTemplateModel,
  SourceCodeWriter,
  fileOrDirExists,
} from "../../../core";
import { FileTransport } from "../../../transport/file.transport";

export const COMPILER_WORKER_PATH = __filename;

if (isMainThread === false) {
  parentPort.on("message", async (batch: FileTemplateModel[]) => {
    const codeWriter = new SourceCodeWriter(new FileTransport());

    for (const model of batch) {
      if (fileOrDirExists(model.path)) {
        // update file
      } else {
        const output = await FileOutput.create(model);
        codeWriter.add(output);
      }
    }

    const { error } = codeWriter.write();

    parentPort.postMessage(true);
  });
}
