import {
  Config,
  StoryResolver,
  Storyboard,
  StoryboardSession,
  Texts,
  TimelineFrame,
} from "../../../../core";
import { ApiConfig } from "../../common/api.config";
import { ApiJson } from "../../common/api.types";
import {
  CreateControllerFrame,
  CreateRoutesForHandlersFrame,
  DefineControllerHandlersFrame,
  DefineControllerNameAndEndpointFrame,
} from "./frames";

export class NewControllerResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateControllerFrame.NAME) {
        return frame.output;
      }
    }

    return {
      models: [],
      entities: [],
      controllers: [],
      routes: [],
    };
  }
}

export class NewControllerStoryboard extends Storyboard<ApiJson> {
  constructor(
    texts: Texts,
    config: Config,
    apiConfig: ApiConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_controller_storyboard",
      session || new StoryboardSession("new_controller_storyboard"),
      new NewControllerResolver()
    );

    this.addFrame(new DefineControllerNameAndEndpointFrame(config, texts))
      .addFrame(
        new DefineControllerHandlersFrame(config, apiConfig, texts),
        (t) => {
          const { name, endpoint } = t.getFrame(0).output;
          return { name, endpoint };
        }
      )
      .addFrame(
        new CreateRoutesForHandlersFrame(config, apiConfig, texts),
        (t) => {
          const { name, endpoint } = t.getFrame(0).output;
          const { handlers, models, entities } = t.getFrame(1).output;

          return {
            name,
            endpoint,
            handlers,
            models,
            entities,
          };
        },
        (t) => {
          const { handlers } = t.getFrame(1).output;
          return handlers.length > 0;
        }
      )
      .addFrame(new CreateControllerFrame(config, apiConfig, texts), (t) => {
        const { name, endpoint } = t.getFrame(0).output;
        const { handlers, models, entities } = t.getFrame(1).output;

        return {
          name,
          endpoint,
          handlers,
          entities,
          models,
        };
      });
  }
}
