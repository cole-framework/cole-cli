import { existsSync } from "fs";
import {
  Config,
  Frame,
  PropJson,
  Texts,
  WriteMethod,
} from "../../../../../core";
import {
  ApiJson,
  CreatePropsInteraction,
  InputNameAndEndpointInteraction,
  InteractionPrompts,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { ApiConfig } from "../../../common/api.config";
import chalk from "chalk";

export class CreateEntityFrame extends Frame<ApiJson> {
  public static NAME = "create_entity_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
    protected texts: Texts
  ) {
    super(CreateEntityFrame.NAME);
  }

  public async run(context?: {
    name?: string;
    endpoint?: string;
    props?: PropJson[];
  }) {
    const { texts, config, apiConfig } = this;
    const result: ApiJson = { entities: [], models: [] };
    const passedProps = context.props || [];
    let name: string;
    let endpoint: string;

    const res = await new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_entity_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
    }).run({
      ...context,
      isEndpointRequired: config.components.entity.isEndpointRequired(),
    });

    name = res.name;
    endpoint = res.endpoint;

    const componentName = config.components.entity.generateName(name);
    const componentPath = config.components.entity.generatePath({
      name,
      endpoint,
    }).path;

    let writeMethod = WriteMethod.Write;

    if (apiConfig.force === false) {
      if (existsSync(componentPath)) {
        writeMethod = await new SelectComponentWriteMethodInteraction(
          texts
        ).run(componentName);
      }
    }

    if (writeMethod !== WriteMethod.Skip) {
      const { props, ...deps } = await new CreatePropsInteraction(
        texts,
        config,
        apiConfig.dependencies_write_method
      ).run({
        endpoint,
        target: "entity",
        areAdditional: passedProps.length > 0,
      });

      result.entities.push(...deps.entities);
      result.models.push(...deps.models);
      let has_model = false;

      if (apiConfig.dependencies_write_method !== WriteMethod.Skip) {
        has_model = await InteractionPrompts.confirm(
          texts.get("do_you_want_to_create_entity_json_model")
        );
      }

      result.entities.push({
        name,
        has_model,
        props: [...passedProps, ...props],
        endpoint,
      });
    }

    return result;
  }
}
