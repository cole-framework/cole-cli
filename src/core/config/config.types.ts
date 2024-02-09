export type GeneratedPath = {
  path: string;
  marker: string;
  hasDynamicFilename: boolean;
};

export type ReservedType = {
  name: string;
  category: "FrameworkDefault" | "DatabaseType" | "Primitive";
};
