import { PropJson } from "../../../components";
import { Config } from "../../../config";
import { Interaction } from "./interaction";

type InteractionResult = {
  props: PropJson[];
  dependencies: any[];
};

export class CreatePropertiesDataInteraction extends Interaction<InteractionResult> {
  constructor(texts: any, protected config: Config) {
    super(texts);
  }
  public async run(
    endpoint: string,
    componentName?: string
  ): Promise<InteractionResult> {
    const { texts, config } = this;
    const props = new Set<PropJson>();
    const dependencies = [];
    let prop: PropJson;

    const question = componentName
      ? texts.QUESTION_ADD_XXX_PROPERTIES.replace("###", componentName)
      : texts.QUESTION_ADD_PROPERTIES;

    // if (await InteractionPrompts.confirm(question)) {
    //   do {
    //     prop = await new CreatePropInteraction(texts).run();

    //     if (
    //       standardTypes.includes(prop.type.toLowerCase()) === false &&
    //       (await InteractionPrompts.confirm(
    //         texts.QUESTION_MODEL_FROM_CUSTOM_TYPE
    //       ))
    //     ) {
    //       const model = ModelSchemaFactory.create(
    //         {
    //           name: prop.type,
    //           type: ModelType.Json,
    //           writeMethod: WriteMethod.Ask,
    //           endpoint,
    //         },
    //         config
    //       );
    //       dependencies.push(model);
    //     }

    //     props.add(prop);
    //   } while (
    //     await InteractionPrompts.confirm(
    //       texts.QUESTION_NEXT_PROP.replace("###", prop?.name)
    //     )
    //   );
    // }

    return {
      props: [...props],
      dependencies,
    };
  }
}
