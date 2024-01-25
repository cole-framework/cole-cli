import os from "os";
import path from "path";

export const configDirname = ".cole";
export const configFilename = "config.json";
export const stateFilename = "state.json";
export const langFilename = "lang.json";
export const mapFilename = "map.json";
export const sessionDirname = "sessions";
export const templatesDirname = "templates";

export const globalConfigPath = path.join(
  os.homedir(),
  configDirname,
  configFilename
);

export const localConfigPath = path.join(
  process.cwd(),
  configDirname,
  configFilename
);

export const localMapPath = path.join(
  process.cwd(),
  configDirname,
  mapFilename
);

export const globalTemplatesPath = path.join(
  os.homedir(),
  configDirname,
  templatesDirname
);

export const localTemplatesPath = path.join(
  process.cwd(),
  configDirname,
  templatesDirname
);

export const globalLangPath = path.join(
  os.homedir(),
  configDirname,
  langFilename
);

export const localLangPath = path.join(
  process.cwd(),
  configDirname,
  langFilename
);

export const globalSessionPath = path.join(
  os.homedir(),
  configDirname,
  sessionDirname
);

export const localSessionPath = path.join(
  process.cwd(),
  configDirname,
  sessionDirname
);

export const localStatePath = path.join(
  process.cwd(),
  configDirname,
  sessionDirname,
  stateFilename
);
