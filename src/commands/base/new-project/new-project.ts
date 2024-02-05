import chalk from "chalk";
import { NewProjectOptions } from "./types";
import { NewProjectInteractiveStrategy } from "./new-project.interactive-strategy";
import { NewProjectOptionsStrategy } from "./new-project.options-strategy";
import { ConfigLoader } from "../../../core";

export const newProject = async (options: NewProjectOptions) => {
  const { content: config, failure } = ConfigLoader.load();

  if (failure) {
    console.log(chalk.red(failure.error.message));
    process.exit(1);
  }

  if (Object.keys(options).length === 0) {
    new NewProjectOptionsStrategy(config).apply(options);
  } else {
    new NewProjectInteractiveStrategy(config).apply();
  }
};
