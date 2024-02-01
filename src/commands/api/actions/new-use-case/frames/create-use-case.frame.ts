import { existsSync } from "fs";
import {
  Config,
  Frame,
  ParamJson,
  Texts,
  TypeInfo,
  WriteMethod,
} from "../../../../../core";
import {
  ApiConfig,
  ApiJson,
  CreateParamInteraction,
  InputNameAndEndpointInteraction,
  InputTextInteraction,
  InteractionPrompts,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { CreateEntityFrame } from "../../new-entity";
import { CreateModelsFrame } from "../../new-model";
import { pascalCase } from "change-case";

export class CreateUseCaseFrame extends Frame<ApiJson> {
  public static NAME = "create_use_case_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
    protected texts: Texts
  ) {
    super(CreateUseCaseFrame.NAME);
  }

  public async run(context?: { name?: string; endpoint?: string }) {
    const { texts, config, apiConfig } = this;
    const result: ApiJson = { entities: [], models: [], use_cases: [] };
    const { name, endpoint } = await new InputNameAndEndpointInteraction({
      nameMessage: texts.get("please_provide_use_case_name"),
      endpointMessage: texts.get("please_provide_endpoint"),
    }).run({
      ...context,
      isEndpointRequired: config.components.model.isEndpointRequired(),
    });
    const output_choices = [
      { name: "None", value: "None" },
      { name: "Entity", value: "Entity" },
      { name: "Model", value: "Model" },
      { name: "Other", value: "Other" },
    ];
    let writeMethod = WriteMethod.Write;
    let res: ApiJson;
    let output;
    const input = new Set<ParamJson>();
    const componentName = config.components.useCase.generateName(name);
    const componentPath = config.components.useCase.generatePath({
      name,
      endpoint,
    }).path;

    if (apiConfig.force === false) {
      if (existsSync(componentPath)) {
        writeMethod = await new SelectComponentWriteMethodInteraction(
          texts
        ).run(componentName);
      }
    }

    if (writeMethod !== WriteMethod.Skip) {
      if (
        await InteractionPrompts.confirm(
          texts.get("does_the_use_case_have_an_input")
        )
      ) {
        let param;
        do {
          param = await new CreateParamInteraction(texts).run();
          input.add(param);

          const type = TypeInfo.create(param.type, config);

          if (apiConfig.dependencies_write_method !== WriteMethod.Skip) {
            if (
              type.isComponentType &&
              (await InteractionPrompts.confirm(
                texts.get("non_standard_type_detected__create_one")
              ))
            ) {
              if (type.isModel) {
                result.models.push({
                  name: type.ref,
                  types: [type.type],
                  endpoint,
                });
              } else if (type.isEntity) {
                result.entities.push({
                  name: type.ref,
                  endpoint,
                });
              }
            }
          }
        } while (
          await InteractionPrompts.confirm(
            texts
              .get("param_###_has_been_added__add_more")
              .replace("###", param?.name)
          )
        );
      }

      const cat = await InteractionPrompts.select<string>(
        texts.get("what_type_of_data_does_the_use_case_return"),
        output_choices
      );

      if (cat === "Entity") {
        res = await new CreateEntityFrame(config, apiConfig, texts).run({
          name: pascalCase(`${name} Output`),
          endpoint,
        });
        output = `Entity<${res.entities.at(-1).name}>`;
      } else if (cat === "Model") {
        res = await new CreateModelsFrame(config, apiConfig, texts).run({
          name: pascalCase(`${name} Output`),
          types: ["json"],
          endpoint,
        });
        output = `Model<${res.models.at(-1).name}>`;
      } else if (cat === "Other") {
        const o = await new InputTextInteraction(
          texts.get("please_enter_use_case_output")
        ).run();
        const type = TypeInfo.create(o, config);
        output = type.tag;
      } else {
        output = "void";
      }

      if (Array.isArray(res?.entities)) {
        result.entities.push(...res.entities);
      }

      if (Array.isArray(res?.models)) {
        result.models.push(...res.models);
      }

      result.use_cases.push({
        name,
        endpoint,
        input: [...input],
        output,
      });
    }

    return result;
  }
}
