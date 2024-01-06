// import { WriteMethod } from "../../../../../core";
// import { ApiData, ComponentSchema, ModelSchema } from "../../../../../types";
// import { ApiDataCreationStrategy } from "../../api-data.strategy";
// import { LangLoader } from "../../../../config/lang-loader";
// import { NewModelStoryboard } from "../storyboards";

// export type NewModelStoryboardResult = {
//   writeMethod: WriteMethod;
//   components: ComponentSchema[];
//   model: ModelSchema;

//   [key: string]: any;
// };

// export class NewModelInteractiveStrategy extends ApiDataCreationStrategy {
//   public readonly name = "new_model";
//   public async apply(apiSchema: ApiData, ...args: unknown[]) {
//     const { config } = this;
//     const { content: texts } = LangLoader.load();

//     const newModelStoryboard = new NewModelStoryboard(texts, config);
//     const result = await newModelStoryboard.run();

//     console.log("->", JSON.stringify(result, null, 2));
//   }
// }
