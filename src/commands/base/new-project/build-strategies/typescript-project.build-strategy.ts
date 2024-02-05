import chalk from "chalk";
import {
  Config,
  Result,
  Strategy,
  Texts,
  localConfigPath,
} from "../../../../core";
import { ProjectDescription } from "../types";
import { promisify } from "util";
import { exec } from "child_process";
import { writeFile } from "fs/promises";

import DefaultConfig from "../../../../defaults/default.config.json";

const execAsync = promisify(exec);

export class TypeScriptProjectBuildStrategy extends Strategy {
  constructor(
    config: Config,
    private texts: Texts
  ) {
    super(config);
  }

  async apply(project: ProjectDescription): Promise<Result> {
    try {
      const { texts } = this;
      const { name, database, source, author, description, license } = project;

      const packageJson = {
        name,
        version: "0.0.0",
        description: description || "",
        main: `build/index.js`,
        scripts: {
          test: 'echo "Error: no test specified" && exit 1',
        },
        author: author || "",
        license: license || "ISC",
      };

      await writeFile("package.json", JSON.stringify(packageJson, null, 2));
      await execAsync("npm init -y");
      await execAsync("npm install typescript @types/node --save-dev");
      await execAsync(`npm install ${this.config.code.module} --save`);
      await execAsync("npx tsc --init");

      database.forEach(async (db) => {
        const dblc = db.toLowerCase();
        if (dblc === "mongo" || dblc === "redis") {
          const dbConfig = this.config.databases.find(
            (db) => db.alias === dblc
          );
          if (dbConfig) {
            await execAsync(`npm install ${db} --save`);
            await execAsync(`npm install ${dbConfig.module} --save`);
          } else {
            console.log(
              chalk
                .red(texts.get("database_###_module_not_found_in_config"))
                .replace("###", dblc)
            );
          }
        }
      });

      if (
        source.toLowerCase() === "express" &&
        this.config.web.alias === "express"
      ) {
        await execAsync("npm install express @types/express --save");
        await execAsync(`npm install ${this.config.web.pckg} --save`);
      }

      // import DefaultConfig from "../../../defaults/default.config.json";
      // read it from imported module
      await writeFile(localConfigPath, JSON.stringify(DefaultConfig, null, 2));

      console.log(chalk.green(texts.get("project_setup_complete")));
      return Result.withoutContent();
    } catch (error) {}
  }
}
