import { Transport } from "../../transport/transport";
import { WriteMethod } from "../enums";
import { FileOutput } from "./file.output";

export type SourceCodeWriterState = { path: string; status: string }[];

export class SourceCodeWriter {
  protected outputs = new Set<FileOutput>();
  constructor(protected transport: Transport) {}

  public add(value: FileOutput | FileOutput[]) {
    if (Array.isArray(value)) {
      value.forEach((v) => this.outputs.add(v));
    } else {
      this.outputs.add(value);
    }
    return this;
  }

  public write(): { error?: Error; state: SourceCodeWriterState } {
    try {
      const { transport, outputs } = this;
      const state = [];
      outputs.forEach((out) => {
        const status = transport.writeOutput(out.content, {
          outputPath: out.path,
          overwrite:
            out.wite_method === WriteMethod.Write ||
            out.wite_method === WriteMethod.Overwrite,
        });
        state.push({ status, path: out.path });
      });
      return { state };
    } catch (error) {
      return { error, state: [] };
    }
  }
}
