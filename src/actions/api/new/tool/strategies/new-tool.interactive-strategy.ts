// import { WriteMethod } from "../../../../../core";
// import { ApiData, ComponentSchema, EntitySchema } from "../../../../../types";
// import { ApiDataCreationStrategy } from "../../api-data.strategy";
// import { LangLoader } from "../../../../config/lang-loader";
// import { NewEntityStoryboard } from "../storyboards";

// export type NewEntityStoryboardResult = {
//   writeMethod: WriteMethod;
//   components: ComponentSchema[];
//   entity: EntitySchema;

//   [key: string]: any;
// };

// export class NewEntityInteractiveStrategy extends ApiDataCreationStrategy {
//   public readonly name = "new_entity";
//   public async apply(apiSchema: ApiData, ...args: unknown[]) {
//     const { config } = this;
//     const { content: texts } = LangLoader.load();

//     const newEntityStoryboard = new NewEntityStoryboard(texts, config);
//     const result = await newEntityStoryboard.run();

//     console.log("->", JSON.stringify(result, null, 2));
//   }
// }
