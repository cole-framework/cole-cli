import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

export class InputNameInteraction extends Interaction<string> {
  constructor(protected inputNameMessage) {
    super();
  }

  public async run(context?: { name?: string }): Promise<string> {
    let name;

    while (typeof name !== "string" || name.length === 0) {
      name = await InteractionPrompts.input(
        this.inputNameMessage,
        context?.name
      );
    }

    return name;
  }
}
