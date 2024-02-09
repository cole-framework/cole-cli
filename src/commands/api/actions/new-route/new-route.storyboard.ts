import { existsSync } from "fs";
import { Config, ModelType, Texts } from "../../../../core";
import { StoryResolver, Storyboard } from "../../../../core/storyboard";
import {
  StoryboardSession,
  TimelineFrame,
} from "../../../../core/storyboard-session";
import { ProjectConfig, ApiJson } from "../../common";
import {
  CreateRouteFrame,
  DefineRouteNameAndEndpointFrame,
  DescribeRouteFrame,
  SelectRequestBodyTypeFrame,
  SelectResponseBodyTypeFrame,
} from "./frames";
import { DescribeControllerFrame } from "./frames/describe-controller.frame";

export class NewRouteStoryResolver extends StoryResolver<ApiJson> {
  resolve(timeline: TimelineFrame[]): ApiJson {
    const result = {
      models: [],
      entities: [],
      controllers: [],
      routes: [],
    };

    for (const frame of timeline) {
      if (frame.name === DescribeControllerFrame.NAME) {
        result.entities.push(...frame.output.entities);
        result.controllers.push(...frame.output.controllers);
      } else if (frame.name === CreateRouteFrame.NAME) {
        result.routes.push(...frame.output.routes);
      }
    }

    return result;
  }
}

export class NewRouteStoryboard extends Storyboard<any> {
  constructor(
    texts: Texts,
    config: Config,
    projectConfig: ProjectConfig,
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
      .addFrame(
        new DescribeControllerFrame(config, projectConfig, texts),
        (t) => {
          const { name, endpoint } = t.getFrame(0).output;
          const { controller, handler, path } = t.getFrame(1).output;
          const { request_body } = t.getFrame(2).output;
          const { response_body } = t.getFrame(3).output;
          return {
            name,
            endpoint,
            controller,
            handler,
            path,
            request_body,
            response_body,
          };
        }
      )
      .addFrame(new CreateRouteFrame(config, projectConfig, texts), (t) => {
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
