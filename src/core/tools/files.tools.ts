import { basename, dirname, join, relative, resolve } from "path";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "fs";

export const ensurePathExists = (path: string) => {
  const targetDirPath = dirname(path);
  if (!existsSync(targetDirPath)) {
    mkdirSync(targetDirPath, { recursive: true });
  }
};

export const fileOrDirExists = (fileOrDir: string) => {
  return fileOrDir ? existsSync(fileOrDir) : false;
};

export const walk = (dir: string): string[] =>
  readdirSync(dir).reduce((files: string[], file: string) => {
    const name = join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...walk(name)] : [...files, name];
  }, []);

export const readJsonFile = <JsonType = unknown>(path: string): JsonType => {
  try {
    let content = readFileSync(path, "utf-8");
    return JSON.parse(content) as JsonType;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSourcePath = (currentPath: string, source: string) => {
  const resolvedPath = resolve(currentPath);

  if (!source) {
    return currentPath;
  }

  if (resolvedPath.endsWith(source)) {
    return resolvedPath;
  }

  const sourceIndex = resolvedPath.lastIndexOf(source);

  if (sourceIndex !== -1) {
    return resolvedPath.substring(0, sourceIndex + source.length);
  }

  return join(currentPath, source);
};

export const isURL = (path: string) =>
  /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(path);

export const fetchData = async <T>(path: string): Promise<T> => {
  if (isURL(path)) {
    const response = await fetch(path);
    const config = await response.json();
    return JSON.parse(config);
  }

  if (existsSync(path)) {
    return JSON.parse(readFileSync(join(process.cwd(), path), "utf-8"));
  }

  const fullPath = join(process.cwd(), path);

  if (existsSync(fullPath)) {
    return JSON.parse(readFileSync(fullPath, "utf-8"));
  }

  return null;
};
