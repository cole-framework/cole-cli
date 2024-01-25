import path from "path";
import { nanoid } from "nanoid";
import { paramCase } from "change-case";
import { localSessionPath } from "./consts";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { Result } from "./result";
import { InteractionPrompts } from "../commands/api/common/interactions/interaction-prompts";
import { SchemaTools } from "./components";
import { Texts } from "./texts";

export type TimelineFrame = {
  index: number;
  name: string;
  type: string;
  output: any;
  completed: boolean;
};
export type TimelineFrameEdit = {
  index?: number;
  name?: string;
  type?: string;
  output?: any;
  completed?: boolean;
};

export type StoryboardSessionModel = {
  storyboard: string;
  timeline: TimelineFrame[];
};

export class SessionTimeline {
  constructor(protected data: TimelineFrame[]) {}

  public get lastFrame(): TimelineFrame {
    return this.data[this.data.length - 1];
  }

  public add(
    frameName: string,
    frameType: string,
    frameIndex: number,
    frameOutput: any,
    completed: boolean
  ) {
    const item = {
      index: this.data.length,
      name: frameName,
      type: frameType,
      output: frameOutput,
      frameIndex,
      completed,
    };
    this.data.push(item);

    return { ...item };
  }

  public update(item: TimelineFrameEdit) {
    const safeItem = SchemaTools.removeNullUndefined(item);
    Object.assign(this.data[item.index], safeItem);
  }

  public list(start?: number, end?: number): TimelineFrame[] {
    return this.data.slice(start, end);
  }
}

export class StoryboardSession {
  public readonly id = nanoid();
  protected sessionPath: string;
  protected model: StoryboardSessionModel;
  protected sessionTimeline: SessionTimeline;

  constructor(
    public readonly name: string,
    public readonly parentSession?: string
  ) {
    this.sessionPath = this.generatePath(name, parentSession);
  }

  protected generatePath(name: string, parentSession?: string): string {
    return path.join(
      localSessionPath,
      `${paramCase(parentSession ? parentSession + " " + name : name)}.json`
    );
  }

  public get timeline(): SessionTimeline {
    return this.sessionTimeline;
  }

  public async load() {
    try {
      const { name: storyboard, sessionPath, parentSession } = this;
      const texts = await Texts.load();
      if (existsSync(localSessionPath) === false) {
        mkdirSync(localSessionPath, { recursive: true });
      }
      if (existsSync(sessionPath)) {
        if (
          !!parentSession ||
          (await InteractionPrompts.confirm(texts.get("CONTINUE_PREV_SESSION")))
        ) {
          this.model = JSON.parse(readFileSync(sessionPath, "utf-8"));
          this.sessionTimeline = new SessionTimeline(this.model.timeline);
          return;
        }
      }
      this.model = { storyboard, timeline: [] };
      this.sessionTimeline = new SessionTimeline(this.model.timeline);
    } catch (error) {
      console.log(error);
    }
  }

  public save(): Result {
    try {
      const { model, sessionPath } = this;
      writeFileSync(sessionPath, JSON.stringify(model, null, 2), "utf-8");
      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  public async clear(): Promise<Result> {
    try {
      if (existsSync(this.sessionPath)) {
        unlinkSync(this.sessionPath);
      }
      this.model = null;
      this.sessionTimeline = null;
      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
