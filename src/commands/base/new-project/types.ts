export type NewProjectOptions = {
  name: string;
  lang: string;
  source: string;
  framework?: string;
  database?: string[];
};

export type ProjectDescription = {
  language: string;
  database: string[];
  source: string;
  name?: string;
  author?: string;
  description?: string;
  license?: string;
};