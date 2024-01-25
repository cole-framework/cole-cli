import { Interaction } from "./interaction";
import { InteractionPrompts } from "./interaction-prompts";

type InputAndName = { name: string; endpoint: string };

export class InputNameAndEndpointInteraction extends Interaction<InputAndName> {
  constructor(
    private texts: {
      nameMessage: string;
      nameHint?: string;
      endpointMessage: string;
      endpointHint?: string;
    }
  ) {
    super();
  }

  public async run(context?: {
    name?: string;
    endpoint?: string;
    isEndpointRequired?: boolean;
  }): Promise<InputAndName> {
    const {
      texts: { nameMessage, nameHint, endpointMessage, endpointHint },
    } = this;
    let name;
    let endpoint;

    while (typeof name !== "string") {
      name = await InteractionPrompts.input(
        nameMessage,
        context?.name,
        nameHint
      );
    }

    if (context?.isEndpointRequired) {
      while (typeof endpoint !== "string") {
        endpoint = await InteractionPrompts.input(
          endpointMessage,
          context?.endpoint,
          endpointHint
        );
      }
    }

    return { name, endpoint };
  }
}
