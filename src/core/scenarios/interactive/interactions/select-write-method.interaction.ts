import { WriteMethod } from "../../../enums";
import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class SelectWriteMethodInteraction extends Interaction<WriteMethod> {
  constructor(texts: any) {
    super(texts);
  }
  public async run(componentName?: string): Promise<WriteMethod> {
    const { texts } = this;
    let action;

    const question = componentName
      ? texts.QUESTION_WRITE_METHOD_WHEN_XXX_FOUND.replace("###", componentName)
      : texts.SELECT_WRITE_METHOD;

    while (!action) {
      action = await InteractionPrompts.select<string>(question, [
        {
          name: WriteMethod.Skip,
          message: texts.NOTHING,
        },
        {
          name: WriteMethod.Overwrite,
          message: texts.OVERWRITE_IT,
        },
        {
          name: WriteMethod.Patch,
          message: texts.UPDATE_IT,
        },
      ]);
    }

    return action;
  }
}
