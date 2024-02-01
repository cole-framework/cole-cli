import { Config, ModelType, Texts } from "../../../../core";
import { StoryResolver, Storyboard } from "../../../../core/storyboard";
import {
  StoryboardSession,
  TimelineFrame,
} from "../../../../core/storyboard-session";
import { ApiConfig, ApiJson } from "../../common";
import {
  CreateRouteFrame,
  DefineRouteNameAndEndpointFrame,
  DescribeRouteFrame,
  SelectRequestBodyTypeFrame,
  SelectResponseBodyTypeFrame,
} from "./frames";

export class NewRouteStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    for (const frame of timeline) {
      if (frame.name === CreateRouteFrame.NAME) {
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

export class NewRouteStoryboard extends Storyboard<any> {
  constructor(
    texts: Texts,
    config: Config,
    apiConfig: ApiConfig,
    session?: StoryboardSession
  ) {
    super(
      "new_route_storyboard",
      session || new StoryboardSession("new_route_storyboard"),
      new NewRouteStoryResolver()
    );

    this.addFrame(new DefineRouteNameAndEndpointFrame(config, texts))
      .addFrame(new DescribeRouteFrame(config, texts), (t) => {
        const { name, endpoint } = t.getFrame(0).output;
        return { name, endpoint };
      })
      .addFrame(new SelectRequestBodyTypeFrame(texts))
      .addFrame(new SelectResponseBodyTypeFrame(texts))
      .addFrame(new CreateRouteFrame(config, apiConfig, texts), (t) => {
        const { name, endpoint } = t.getFrame(0).output;
        const { path, http_method, controller, handler, auth, validate } =
          t.getFrame(1).output;
        const { request_body } = t.getFrame(2).output;
        const { response_body } = t.getFrame(3).output;

        return {
          name,
          endpoint,
          path,
          http_method,
          controller,
          handler,
          auth,
          validate,
          request_body,
          response_body,
        };
      });
  }
}
