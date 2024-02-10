import { Texts } from "@cole-framework/cole-cli-core";
import { Interaction } from "../../../../core";
import { InteractionPrompts } from "../../../../core";

type InputAndName = { name: string; endpoint: string };

export class InputNameAndEndpointPredefinedInteraction extends Interaction<InputAndName> {
  constructor(
    private texts: Texts,
    protected inputNameMessage = texts.get("INPUT_MODEL_NAME")
  ) {
    super();
  }

  public async run(context?: {
    name?: string;
    endpoint?: string;
    isEndpointRequired?: boolean;
  }): Promise<InputAndName> {
    const { texts } = this;
    let endpoint;
    let name;

    if (context?.isEndpointRequired) {
      while (typeof endpoint !== "string" || endpoint.length === 0) {
        endpoint = await InteractionPrompts.input(
          texts.get("INPUT_ENDPOINT"),
          context?.endpoint
        );
      }
    }

    while (typeof name !== "string" || name.length === 0) {
      name = await InteractionPrompts.input(
        this.inputNameMessage,
        context?.name || endpoint
      );
    }

    return { name, endpoint };
  }
}
