import { existsSync } from "fs";
import { Config, Frame, PropJson, WriteMethod } from "../../../../../core";
import {
  ApiJson,
  InputNameAndEndpointInteraction,
  InputTextInteraction,
  InteractionPrompts,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { CreateModelsFrame } from "../../new-model";
import { Texts } from "@cole-framework/cole-cli-core";

export class CreateSourcesFrame extends Frame<ApiJson> {
  public static NAME = "create_sources_frame";

  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(CreateSourcesFrame.NAME);
  }

  public async run(context?: {
    storages: string[];
    name?: string;
    endpoint?: string;
    props?: PropJson[];
  }) {
    const { texts, config } = this;
    const createModelsFrame = new CreateModelsFrame(config, texts);
    const result: ApiJson = { models: [], entities: [], sources: [] };
    const storages = context.storages ? [...context.storages] : [];
    const { name, endpoint } = await new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_source_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
    }).run({
      ...context,
      isEndpointRequired: config.components.source.isEndpointRequired(),
    });
    let writeMethod = WriteMethod.Write;

    for (const storage of storages) {
      const componentName = config.components.source.generateName(name);
      const componentPath = config.components.source.generatePath({
        name,
        type: storage,
        endpoint,
      }).path;

      if (config.project.force === false) {
        if (existsSync(componentPath)) {
          writeMethod = await new SelectComponentWriteMethodInteraction(
            texts
          ).run(componentName);
        }
      }

      const table = await new InputTextInteraction(
        texts.get("please_enter_storage_###_table_name").replace("###", storage)
      ).run();

      const model = await new InputTextInteraction(
        texts.get("please_enter_storage_###_model_name").replace("###", storage)
      ).run({
        value: name,
        hint: texts.get("hint___please_enter_storage_model_name"),
      });

      if (config.project.dependencies_write_method !== WriteMethod.Skip) {
        if (
          await InteractionPrompts.confirm(
            texts
              .get("do_you_want_to_define_the_contents_of_storage_model_###")
              .replace("###", storage)
          )
        ) {
          const createModelsResult = await createModelsFrame.run({
            types: [storage],
            name: model,
            endpoint,
          });

          result.entities.push(...createModelsResult.entities);
          result.models.push(...createModelsResult.models);
        }
      }

      if (writeMethod !== WriteMethod.Skip) {
        result.sources.push({
          name,
          table,
          model,
          storages: [storage],
          endpoint,
        });
      }
    }

    return result;
  }
}
