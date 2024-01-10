import { Transport } from "../../transport/transport";

export class SourceCodeWriter {
  protected outputs = new Set<any>();
  constructor(protected transport: Transport) {}

  public add(value: any | any[]) {
    if (Array.isArray(value)) {
      value.forEach((v) => this.outputs.add(v));
    } else {
      this.outputs.add(value);
    }
    return this;
  }

  public write(): { error?: Error } {
    try {
      const { transport, outputs } = this;

      outputs.forEach((out) => {
        transport.writeOutput(out.content, {
          outputPath: out.path,
        });
      });
      return {};
    } catch (error) {
      return { error };
    }
  }
}