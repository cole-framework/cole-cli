import {
  Config,
  Frame,
  ParamSchema,
  Texts,
  TypeInfo,
  WriteMethod,
} from "../../../../../core";
import { ApiConfig, InteractionPrompts } from "../../../common";
import { EntityJson } from "../../new-entity";
import { ModelJson } from "../../new-model";
import { HandlerJson } from "../types";
import { DefineHandlerInteraction } from "./interactions/define-handler.interaction";

export type ControllerHandlers = {
  handlers: HandlerJson[];
  models: ModelJson[];
  entities: EntityJson[];
};

export class DefineControllerHandlersFrame extends Frame<ControllerHandlers> {
  public static NAME = "define_controller_handlers_frame";

  constructor(
    protected config: Config,
    protected apiConfig: ApiConfig,
    protected texts: Texts
  ) {
    super(DefineControllerHandlersFrame.NAME);
  }

  private isUnique(types, type) {
    if (type.isModel) {
      return (
        types.findIndex(
          (r) =>
            r.ref.toLowerCase() === type.ref.toLowerCase() &&
            r.type.type === type.type
        ) === -1
      );
    }
    if (type.isEntity) {
      return (
        types.findIndex(
          (r) => r.ref.toLowerCase() === type.ref.toLowerCase()
        ) === -1
      );
    }

    return true;
  }

  public async run(context: { endpoint: string; name: string }) {
    const { texts, config, apiConfig } = this;
    const result = { handlers: [], models: [], entities: [] };

    if (
      await InteractionPrompts.confirm(
        texts
          .get("do_you_want_to_add_handlers_to_###")
          .replace("###", context.name || "")
      )
    ) {
      let handler: HandlerJson;
      do {
        handler = await new DefineHandlerInteraction(texts).run();
        result.handlers.push(handler);

        if (apiConfig.dependencies_write_method !== WriteMethod.Skip) {
          const types = [];
          if (handler.output) {
            const rt = TypeInfo.create(handler.output, config);
            if (rt.isComponentType && this.isUnique(types, rt)) {
              types.push(rt);
            }
          }

          if (Array.isArray(handler.input)) {
            handler.input.forEach((str) => {
              const param = ParamSchema.create(str, config);
              if (
                param.type.isComponentType &&
                this.isUnique(types, param.type)
              ) {
                types.push(param.type);
              }
            });
          }

          for (const type of types) {
            if (
              type.isModel &&
              (await InteractionPrompts.confirm(
                texts.get("non_standard_type_detected__create_one")
              ))
            ) {
              const c = result.models.find(
                (m) => m.name === type.ref && m.types.includes(type.type)
              );
              if (!c) {
                result.models.push({
                  name: type.ref,
                  types: [type.type],
                  endpoint: context.endpoint,
                });
              }
            } else if (
              type.isEntity &&
              (await InteractionPrompts.confirm(
                texts.get("non_standard_type_detected__create_one")
              ))
            ) {
              const c = result.entities.find((m) => m.name === type.ref);
              if (!c) {
                result.entities.push({
                  name: type.ref,
                  endpoint: context.endpoint,
                });
              }
            }
          }
        }
      } while (
        await InteractionPrompts.confirm(
          texts
            .get("handler_###_has_been_added__add_more")
            .replace("###", handler?.name)
        )
      );
    }

    return result;
  }
}
