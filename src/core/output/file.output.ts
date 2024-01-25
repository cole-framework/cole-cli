export class FileOutput {
  constructor(
    public readonly path: string,
    public readonly write_method: string,
    public readonly content: string
  ) {}
}
