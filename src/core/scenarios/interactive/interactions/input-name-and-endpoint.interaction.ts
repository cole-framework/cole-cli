import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

type InputAndName = { name: string; endpoint: string };

export class InputNameAndEndpointInteraction extends Interaction<InputAndName> {
  constructor(
    texts: any,
    protected inputNameMessage = texts.INPUT_MODEL_NAME,
    protected inputNameHint?: string
  ) {
    super(texts);
  }

  public async run(context?: {
    name?: string;
    endpoint?: string;
    isEndpointRequired?: boolean;
  }): Promise<InputAndName> {
    const { texts } = this;
    let endpoint = context?.endpoint;
    let name = context?.name;

    if (context?.isEndpointRequired) {
      while (typeof endpoint !== "string" || endpoint.length === 0) {
        endpoint = await InteractionPrompts.input(texts.INPUT_ENDPOINT);
      }
    }

    while (typeof name !== "string" || name.length === 0) {
      name = await InteractionPrompts.input(
        this.inputNameMessage,
        endpoint,
        this.inputNameHint
      );
    }

    return { name, endpoint };
  }
}
