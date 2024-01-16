import os from "os";
import { CompilationConfigData } from "./compilation-config.types";

export class CompilationConfig {
  public static create(data: CompilationConfigData): CompilationConfig {
    const thread_count = data.thread_count
      ? data.thread_count === -1
        ? os.cpus().length
        : data.thread_count
      : 2;

    return new CompilationConfig(
      data.source_dirname || "src",
      data.batch_size || 10,
      thread_count,
      data.transport || "file"
    );
  }

  constructor(
    public readonly sourceDirname: string,
    public readonly batchSize: number,
    public readonly threadCount: number,
    public readonly transport: string
  ) {}
}
