import { Texts } from "../../../../core";
import { WriteMethod } from "../../../../core/enums";
import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class SelectComponentWriteMethodInteraction extends Interaction<WriteMethod> {
  constructor(private texts: Texts) {
    super();
  }
  public async run(componentName: string): Promise<WriteMethod> {
    const { texts } = this;
    let action;

    while (!action) {
      action = await InteractionPrompts.select<string>(
        texts
          .get("component_###_was_found__what_do_you_want_to_do_with_it")
          .replace("###", componentName),
        [
          {
            name: WriteMethod.Skip,
            message: texts.get("skip_this_component"),
          },
          {
            name: WriteMethod.Overwrite,
            message: texts.get("overwrite_this_component"),
          },
        ]
      );
    }

    return action;
  }
}
