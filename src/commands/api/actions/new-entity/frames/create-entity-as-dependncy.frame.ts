import { Config, Frame, PropJson, Texts } from "../../../../../core";
import { ApiJson, InputNameAndEndpointInteraction } from "../../../common";
import { ProjectConfig } from "../../../common/project.config";
import chalk from "chalk";
import { CreateEntityFrame } from "./create-entity.frame";

export class CreateEntityAsDependencyFrame extends Frame<ApiJson> {
  public static NAME = "create_entity_as_dependency_frame";

  constructor(
    protected config: Config,
    protected projectConfig: ProjectConfig,
    protected texts: Texts
  ) {
    super(CreateEntityAsDependencyFrame.NAME);
  }

  public async run(context: {
    dependencyOf: string;
    name?: string;
    endpoint?: string;
    props?: PropJson[];
  }) {
    const { texts, config, projectConfig } = this;
    const { dependencyOf, ...rest } = context;

    console.log(
      chalk.gray(
        texts
          .get("setup_entity_as_dependency_of_###")
          .replace("###", dependencyOf)
      )
    );

    if (projectConfig.with_dependencies) {
      return new CreateEntityFrame(config, projectConfig, texts).run(rest);
    }

    const { name, endpoint } = await new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_entity_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
    }).run({
      ...context,
      isEndpointRequired: config.components.entity.isEndpointRequired(),
    });

    return {
      entities: [
        {
          name,
          endpoint,
        },
      ],
      models: [],
    };
  }
}
