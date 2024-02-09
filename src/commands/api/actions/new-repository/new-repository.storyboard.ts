import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../../core";
import { ProjectConfig } from "../../common/project.config";
import { ApiJson } from "../../common/api.types";
import { CreateEntityAsDependencyFrame } from "../new-entity";
import { CreateModelsAsDependenciesFrame } from "../new-model";
import {
  CreateRepositoryFrame,
  DefineRepositoryNameAndEndpointFrame,
  DescribeRepositoryFrame,
} from "./frames";

export class NewRepositoryStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateRepositoryFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
      repositories: [],
    };
  }
}

export class NewRepositoryStoryboard extends Storyboard<ApiJson> {
  constructor(
    texts: Texts,
    config: Config,
    projectConfig: ProjectConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_repository_storyboard",
      session || new StoryboardSession("new_repository_storyboard"),
      new NewRepositoryStoryResolver()
    );

    this.addFrame(new DefineRepositoryNameAndEndpointFrame(config, texts))
      .addFrame(new DescribeRepositoryFrame(config, texts))
      .addFrame(
        new CreateEntityAsDependencyFrame(config, projectConfig, texts),
        (t) => {
          const { name, endpoint } = t.getFrame(0).output;
          return { name, endpoint, dependencyOf: "repository" };
        }
      )
      .addFrame(
        new CreateModelsAsDependenciesFrame(config, projectConfig, texts),
        (t) => {
          const { name, endpoint } = t.getFrame(0).output;
          const { databases } = t.getFrame(1).output;
          const { entities } = t.getFrame(2).output;
          const props = entities.at(-1)?.props || [];

          return {
            name,
            endpoint,
            dependencyOf: "repository",
            types: databases,
            props,
          };
        },
        (t) => {
          const { databases } = t.getFrame(1).output;
          return databases.length > 0;
        }
      )
      .addFrame(
        new CreateRepositoryFrame(config, projectConfig, texts),
        (t) => {
          const { name, endpoint } = t.getFrame(0).output;
          const { entities } = t.getFrame(2).output;
          const { models } = t.getFrame(3).output;
          const {
            createInterface,
            createImplementation,
            createFactory,
            willHaveAdditionalContent,
            databases,
          } = t.getFrame(1).output;

          const entity = entities.at(-1);

          return {
            name,
            endpoint,
            entity,
            models,
            createInterface,
            createImplementation,
            createFactory,
            willHaveAdditionalContent,
            databases,
          };
        },
        (t) => {
          const { createInterface } = t.getFrame(1).output;
          return createInterface;
        }
      );
  }
}
