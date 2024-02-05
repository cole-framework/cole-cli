import chalk from "chalk";
import {
  Config,
  Result,
  Strategy,
  Texts,
  localConfigPath,
} from "../../../../core";
import { promisify } from "util";
import { exec } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { ProjectDescription } from "../../new-project";

import DefaultConfig from "../../../../defaults/default.config.json";

const execAsync = promisify(exec);

export class TypeScriptProjectInitStrategy extends Strategy {
  constructor(
    config: Config,
    private texts: Texts
  ) {
    super(config);
  }

  async apply(project: ProjectDescription): Promise<Result> {
    try {
      const { texts } = this;
      const { database, source } = project;

      const packageString = await readFile("./package.json", "utf-8");

      if (!packageString) {
        throw Error("no_package_json_detected__use_new_project_command");
      }

      const packageJson = JSON.parse(packageString);
      const dependencies = Object.keys(packageJson.dependencies);

      await execAsync(`npm install ${this.config.code.module} --save`);

      database.forEach(async (db) => {
        const dblc = db.toLowerCase();
        if (dblc === "mongo" || dblc === "redis") {
          const dbpckg = dependencies.find(
            (d) => d === dblc || d.includes(dblc)
          );

          const dbConfig = this.config.databases.find(
            (db) => db.alias === dblc
          );
          if (!dbpckg) {
            await execAsync(`npm install ${db} --save`);
          }
          if (dbConfig) {
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

      // if (
      //   source.toLowerCase() === "express" &&
      //   this.config.web.alias === "express"
      // ) {
      //   const webpckg = dependencies.find(
      //     (d) =>
      //       d === this.config.web.alias || d.includes(this.config.web.alias)
      //   );

      //   if (webpckg) {
      //     await execAsync("npm install express @types/express --save");
      //   }

      //   await execAsync(`npm install ${this.config.web.pckg} --save`);
      // }

      // import DefaultConfig from "../../../defaults/default.config.json";
      // read it from imported module
      await writeFile(localConfigPath, JSON.stringify(DefaultConfig, null, 2));

      console.log(chalk.green(texts.get("init_complete")));
      return Result.withoutContent();
    } catch (error) {}
  }
}
