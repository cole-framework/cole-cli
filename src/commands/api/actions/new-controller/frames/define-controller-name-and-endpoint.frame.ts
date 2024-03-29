import { Texts } from "@cole-framework/cole-cli-core";
import { Config, Frame } from "../../../../../core";
import { InputNameAndEndpointInteraction } from "../../../common";

export type ControllerNameAndEndpoint = {
  name: string;
  endpoint: string;
};

export class DefineControllerNameAndEndpointFrame extends Frame<ControllerNameAndEndpoint> {
  public static NAME = "define_controller_name_and_endpoint_frame";

  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(DefineControllerNameAndEndpointFrame.NAME);
  }

  public async run() {
    const { texts, config } = this;

    return new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_controller_name"),
      nameHint: texts.get("hint___please_provide_controller_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
      endpointHint: texts.get("hint___please_provide_endpoint"),
    }).run({
      isEndpointRequired: config.components.controller.isEndpointRequired(),
    });
  }
}
