import { Texts } from "@cole-framework/cole-cli-core";
import { Config, Frame } from "../../../../../core";
import { ApiJson } from "../../../common";

export class CreateControllerAsDependencyFrame extends Frame<ApiJson> {
  public static NAME = "create_controller_as_dependency_frame";

  constructor(
    protected config: Config,
    protected texts: Texts
  ) {
    super(CreateControllerAsDependencyFrame.NAME);
  }

  public async run(context: any) {
    return null;
  }
}
