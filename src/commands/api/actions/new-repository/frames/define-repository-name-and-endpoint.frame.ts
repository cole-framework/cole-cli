import { Texts } from "@cole-framework/cole-cli-core";
import { Config, Frame } from "../../../../../core";
import { InputNameAndEndpointInteraction } from "../../../common";

export type RepositoryNameAndEndpoint = {
  name: string;
  endpoint: string;
};

export class DefineRepositoryNameAndEndpointFrame extends Frame<RepositoryNameAndEndpoint> {
  public static NAME = "define_repository_name_and_endpoint_frame";

  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(DefineRepositoryNameAndEndpointFrame.NAME);
  }

  public async run() {
    const { texts, config } = this;

    return new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_repository_name"),
      nameHint: texts.get("hint___please_provide_repository_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
      endpointHint: texts.get("hint___please_provide_endpoint"),
    }).run({
      isEndpointRequired: config.components.repository.isEndpointRequired(),
    });
  }
}
