import { Config, ModelType } from "../../../../../core";
import {
  StoryResolver,
  Storyboard,
} from "../../../../../core/scenarios/interactive/storyboard";
import {
  StoryboardSession,
  TimelineFrame,
} from "../../../../../core/scenarios/interactive/storyboard-session";

export type NewRouteResult = {};

export class NewRouteStoryResolver extends StoryResolver<NewRouteResult> {
  resolve(timeline: TimelineFrame[]): NewRouteResult {
    const result: NewRouteResult = { entity: null, models: [], mappers: [] };

    return result;
  }
}

export class NewRouteStoryboard extends Storyboard<any> {
  constructor(texts: any, config: Config, session?: StoryboardSession) {
    super(
      "new_route_storyboard",
      session || new StoryboardSession("new_route_storyboard"),
      new NewRouteStoryResolver()
    );
    //
  }
}
