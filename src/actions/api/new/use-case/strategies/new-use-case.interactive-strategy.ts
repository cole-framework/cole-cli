import { LangLoader, WriteMethod } from "../../../../../core";
import { Strategy } from "../../../../../core/strategy";
import { ApiData } from "../../api.types";

export type NewUseCaseStoryboardResult = {
  writeMethod: WriteMethod;
  components: any[];

  [key: string]: any;
};

export class NewUseCaseInteractiveStrategy extends Strategy {
  public readonly name = "new_use_case";
  public async apply(apiSchema: ApiData, ...args: unknown[]) {
    const { config } = this;
    const { content: texts } = LangLoader.load();

    // const newUseCaseStoryboard = new NewUseCaseStoryboard(texts, config);
    // const result = await newUseCaseStoryboard.run();

    // console.log("->", JSON.stringify(result, null, 2));
  }
}
