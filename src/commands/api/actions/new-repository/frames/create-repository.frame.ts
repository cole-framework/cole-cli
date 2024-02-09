import { existsSync } from "fs";
import { Config, Frame, Texts, WriteMethod } from "../../../../../core";
import {
  ProjectConfig,
  ApiJson,
  DefineMethodsInteraction,
  SelectComponentWriteMethodInteraction,
} from "../../../common";
import { EntityJson } from "../../new-entity";
import { RepositoryDescription } from "./describe-repository.frame";
import { RepositoryNameAndEndpoint } from "./define-repository-name-and-endpoint.frame";
import { ModelJson } from "../../new-model";

export class CreateRepositoryFrame extends Frame<ApiJson> {
  public static NAME = "create_repository_frame";

  constructor(
    protected config: Config,
    protected projectConfig: ProjectConfig,
    protected texts: Texts
  ) {
    super(CreateRepositoryFrame.NAME);
  }

  public async run(
    context: RepositoryDescription &
      RepositoryNameAndEndpoint & { entity: EntityJson; models: ModelJson[] }
  ) {
    const { texts, config, projectConfig } = this;
    const {
      name,
      endpoint,
      entity,
      models,
      willHaveAdditionalContent,
      databases,
      createInterface: build_interface,
      createFactory: build_factory,
    } = context;
    const result: ApiJson = { models: [], entities: [], repositories: [] };
    const componentName = config.components.repository.generateName(name);
    const componentPath = config.components.repository.generatePath({
      name,
      endpoint,
    }).path;
    let writeMethod = WriteMethod.Write;

    if (projectConfig.force === false) {
      if (existsSync(componentPath)) {
        writeMethod = await new SelectComponentWriteMethodInteraction(
          texts
        ).run(componentName);
      }
    }

    if (writeMethod !== WriteMethod.Skip) {
      const contexts = [];
      let defineMethodsResult = { methods: [], entities: [], models: [] };

      if (willHaveAdditionalContent) {
        const references = { models: [...models], entities: [] };
        if (entity) {
          references.entities.push(entity);
        }
        defineMethodsResult = await new DefineMethodsInteraction(
          texts,
          config,
          projectConfig.dependencies_write_method,
          references
        ).run({ endpoint: endpoint, component: "repository" });

        result.entities.push(...defineMethodsResult.entities);
        result.models.push(...defineMethodsResult.models);
      }

      models.forEach((model) => {
        contexts.push({
          type: model.types[0],
          model: model.name,
        });
      });

      result.repositories.push({
        name,
        methods: defineMethodsResult.methods,
        entity: entity.name,
        endpoint,
        build_interface,
        use_default_impl:
          willHaveAdditionalContent === false && databases.length === 1,
        build_factory,
        contexts,
      });
    }

    return result;
  }
}
