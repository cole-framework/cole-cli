import chalk from "chalk";
import { Result, Strategy, Texts, localConfigPath } from "../../../../core";
import { ProjectDescription } from "../types";
import { promisify } from "util";
import { exec } from "child_process";
import { writeFile } from "fs/promises";

import DefaultConfig from "../../../../defaults/default.config.json";

const execAsync = promisify(exec);

export class TypeScriptProjectBuildStrategy extends Strategy {
  constructor(private texts: Texts) {
    super();
  }

  async apply(project: ProjectDescription): Promise<Result> {
    try {
      const { texts } = this;
      const { name, database, source, author, description, license } = project;

      // import DefaultConfig from "../../../defaults/default.config.json";
      // read it from imported module
      await writeFile(localConfigPath, JSON.stringify(DefaultConfig, null, 2));

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

      await writeFile(
        "package.json",
        JSON.stringify(packageJson, null, 2)
      ).catch((e) => console.log(e));
      await execAsync("npm init -y").catch((e) => console.log(e));
      await execAsync("npm install typescript @types/node --save-dev").catch(
        (e) => console.log(e)
      );
      await execAsync(`npm install ${DefaultConfig.code.module} --save`).catch(
        (e) => console.log(e)
      );
      await execAsync("npx tsc --init").catch((e) => console.log(e));

      database.forEach(async (db) => {
        const dblc = db.toLowerCase();
        if (dblc === "mongo" || dblc === "redis") {
          const dbConfig = DefaultConfig.databases.find(
            (db) => db.alias === dblc
          );
          if (dbConfig) {
            await execAsync(`npm install ${db} --save`).catch((e) =>
              console.log(e)
            );
            await execAsync(`npm install ${dbConfig.module} --save`).catch(
              (e) => console.log(e)
            );
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
        DefaultConfig.web.alias === "express"
      ) {
        await execAsync("npm install express @types/express --save").catch(
          (e) => console.log(e)
        );
        await execAsync(
          `npm install ${DefaultConfig.web.package} --save`
        ).catch((e) => console.log(e));
      }

      console.log(chalk.green(texts.get("project_setup_complete")));
      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
