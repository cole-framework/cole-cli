import { Config, Frame, Texts } from "../../../../../core";
import { ApiConfig, ApiJson } from "../../../common";

export class CreateControllerAsDependencyFrame extends Frame<ApiJson> {
  public static NAME = "create_controller_as_dependency_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
    protected texts: Texts
  ) {
    super(CreateControllerAsDependencyFrame.NAME);
  }

  public async run(context: any) {
    return null;
  }
}
