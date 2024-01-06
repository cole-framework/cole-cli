// import { WriteMethod } from "../../../../../core";
// import { ApiData, ComponentSchema, MapperSchema } from "../../../../../types";
// import { ApiDataCreationStrategy } from "../../api-data.strategy";
// import { LangLoader } from "../../../../config/lang-loader";
// import { NewMapperStoryboard } from "../storyboards";

// export type NewMapperStoryboardResult = {
//   writeMethod: WriteMethod;
//   components: ComponentSchema[];
//   mapper: MapperSchema;

//   [key: string]: any;
// };

// export class NewMapperInteractiveStrategy extends ApiDataCreationStrategy {
//   public readonly name = "new_mapper";
//   public async apply(apiSchema: ApiData, ...args: unknown[]) {
//     const { config } = this;
//     const { content: texts } = LangLoader.load();

//     const newMapperStoryboard = new NewMapperStoryboard(texts, config);
//     const result = await newMapperStoryboard.run();

//     console.log("->", JSON.stringify(result, null, 2));
//   }
// }
