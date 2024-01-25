import { existsSync } from "fs";
import {
  Config,
  Frame,
  PropJson,
  Texts,
  WriteMethod,
} from "../../../../../core";
import {
  ApiConfig,
  ApiJson,
  InputNameAndEndpointInteraction,
  InputTextInteraction,
  InteractionPrompts,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { CreateModelsFrame } from "../../new-model";

export class CreateSourcesFrame extends Frame<ApiJson> {
  public static NAME = "create_sources_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
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
    const { texts, config, apiConfig } = this;
    const createModelsFrame = new CreateModelsFrame(config, apiConfig, texts);
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

      if (apiConfig.force === false) {
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

      if (apiConfig.dependencies_write_method !== WriteMethod.Skip) {
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
