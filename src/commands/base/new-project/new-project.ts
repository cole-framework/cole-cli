import { NewProjectOptions } from "./types";
import { NewProjectInteractiveStrategy } from "./new-project.interactive-strategy";
import { NewProjectOptionsStrategy } from "./new-project.options-strategy";

export const newProject = async (options: NewProjectOptions) => {
  if (Object.keys(options).length === 0) {
    new NewProjectInteractiveStrategy().apply();
  } else {
    new NewProjectOptionsStrategy().apply(options);
  }
};
