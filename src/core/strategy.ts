import { Config } from "./config";

export abstract class Strategy<T = void> {
  constructor(protected config: Config) {}

  public abstract apply(...args: unknown[]): T;
}
