import { LangLoader, WriteMethod } from "../../../../../core";
import { ApiDataCreationStrategy } from "../../api-data.strategy";
import { ApiData } from "../../api.types";

export type NewSourceStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];

  [key: string]: any;
};

export class NewSourceInteractiveStrategy extends ApiDataCreationStrategy {
  public readonly name = "new_source";
  public async apply(apiSchema: ApiData, ...args: unknown[]) {
    const { config } = this;
    const { content: texts } = LangLoader.load();

    // const newSourceStoryboard = new NewSourceStoryboard(texts, config);
    // const result = await newSourceStoryboard.run();

    // console.log("->", JSON.stringify(result, null, 2));
  }
}
