export declare abstract class Transport {
  abstract writeOutput(
    data: string,
    options?: TransportOptions
  ): Promise<boolean> | boolean | void;
}

export type TransportOptions = {
  caller?: string;
  [key: string]: unknown;
};
