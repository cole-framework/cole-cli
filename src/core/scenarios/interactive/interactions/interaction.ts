export abstract class Interaction<T = any> {
  constructor(protected texts?: any) {}
  public abstract run(...args: unknown[]): Promise<T>;
}
