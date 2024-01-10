import { paramCase } from "change-case";
import { Config, MethodTools, PropTools, WriteMethod } from "../../../../core";
import chalk from "chalk";
import { Entity, EntityFactory } from "../entity";
import { Mapper, MapperFactory } from "../mapper";
import { Model, ModelFactory } from "../model";
import { Source, SourceFactory } from "../source";
import { RepositoryImplFactory } from "./repository-impl.factory";
import { RepositoryComponentFactory } from "./repository.factory";
import {
  RepositoryJson,
  DataContext,
  Repository,
  RepositoryImpl,
  RepositoryFactory,
} from "./types";

export class RepositoryJsonParser {
  constructor(
    private config: Config,
    private texts: any,
    private writeMethod: { component: WriteMethod; dependency: WriteMethod }
  ) {}

  buildAbstract(
    data: RepositoryJson,
    entity: Entity,
    entitiesRef: Entity[],
    modelsRef: Model[]
  ) {
    const { config, writeMethod, texts } = this;
    const { name, endpoint, props, methods } = data;
    const entities = [];
    const models = [];

    if (!endpoint && config.components.repository.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      console.log(
        chalk.yellow(
          texts.INFO_REPOSITORY_XXX_SKIPPED_ERROR.replace("###", name)
        )
      );
      return;
    }

    const repository = RepositoryComponentFactory.create(
      {
        name,
        endpoint,
        props: PropTools.arrayToData(props, config.reservedTypes, {
          dependencies: [],
          addons: {},
        }),
        methods: MethodTools.arrayToData(methods, config.reservedTypes, {
          dependencies: [],
          addons: {},
        }),
      },
      entity,
      writeMethod.component,
      config
    );

    repository.unresolvedDependencies.forEach((type) => {
      if (type.isModel) {
        let model;
        model = modelsRef.find((m) => {
          return m.type.name === type.name && m.type.type === type.type;
        });

        if (!model) {
          model = ModelFactory.create(
            { name: type.name, endpoint: repository.endpoint, type: type.type },
            writeMethod.dependency,
            config,
            []
          );
          models.push(model);
        }
        repository.addDependency(model);
      } else if (type.isEntity && type.name !== entity.type.name) {
        let e;
        e = entitiesRef.find((m) => m.type.name === type.name);
        if (!e) {
          e = EntityFactory.create(
            { name: type.name, endpoint: repository.endpoint },
            null,
            writeMethod.dependency,
            config,
            []
          );
          entities.push(e);
        }
        repository.addDependency(e);
      }
    });

    return { repository, entities, models };
  }

  buildImpl(
    data: RepositoryJson,
    entity: Entity,
    contexts: DataContext[],
    entitiesRef: Entity[],
    modelsRef: Model[]
  ) {
    const { config, writeMethod, texts } = this;
    const { name, endpoint, props, methods } = data;
    const entities = [];
    const models = [];

    if (!endpoint && config.components.repositoryImpl.isEndpointRequired()) {
      console.log(chalk.red(texts.MISSING_ENDPOINT));
      console.log(
        chalk.yellow(
          texts.INFO_REPOSITORY_IMPL_XXX_SKIPPED_ERROR.replace("###", name)
        )
      );
      return;
    }

    const impl = RepositoryImplFactory.create(
      {
        name,
        endpoint,
        props: PropTools.arrayToData(props, config.reservedTypes, {
          dependencies: [],
          addons: {},
        }),
        methods: MethodTools.arrayToData(methods, config.reservedTypes, {
          dependencies: [],
          addons: {},
        }),
      },
      entity,
      contexts,
      writeMethod.component,
      config
    );

    impl.unresolvedDependencies.forEach((type) => {
      if (type.isModel) {
        let model;
        model = modelsRef.find(
          (m) => m.type.name === type.name && m.type.type === type.type
        );

        if (!model) {
          model = ModelFactory.create(
            { name: type.name, endpoint: impl.endpoint, type: type.type },
            writeMethod.dependency,
            config,
            []
          );
          models.push(model);
        }
        impl.addDependency(model);
      } else if (type.isEntity && type.name !== entity.type.name) {
        let e;
        e = entitiesRef.find((m) => m.type.name === type.name);
        if (!e) {
          e = EntityFactory.create(
            { name: type.name, endpoint: impl.endpoint },
            null,
            writeMethod.dependency,
            config,
            []
          );
          entities.push(e);
        }
        impl.addDependency(e);
      }
    });

    return { impl, models, entities };
  }

  buildFactory(
    data: RepositoryJson,
    repository: Repository,
    impl: RepositoryImpl,
    contexts: DataContext[]
  ): RepositoryFactory {
    return null;
  }

  build(
    list: RepositoryJson[],
    entitiesRef: Entity[],
    modelsRef: Model[],
    mappersRef: Mapper[],
    sourcesRef: Source[]
  ): {
    repositories: Repository[];
    repository_impls: RepositoryImpl[];
    repository_factories: RepositoryFactory[];
    models: Model[];
    entities: Entity[];
    mappers: Mapper[];
    sources: Source[];
  } {
    const { config, writeMethod } = this;
    const repositories: Repository[] = [];
    const repository_impls: RepositoryImpl[] = [];
    const repository_factories: RepositoryFactory[] = [];
    const models: Model[] = [];
    const mappers: Mapper[] = [];
    const sources: Source[] = [];
    const entities: Entity[] = [];

    for (const data of list) {
      const ctxs = [];
      let repository;
      let impl;

      const { endpoint, contexts } = data;

      const build_interface =
        typeof data.build_factory === "boolean" ? data.build_interface : true;
      const use_default_impl =
        typeof data.use_default_impl === "boolean"
          ? data.use_default_impl
          : (Array.isArray(data.methods) && data.methods.length > 0) ||
            (Array.isArray(data.contexts) && data.contexts.length > 1);
      const build_factory = false;

      const entityName = data.entity || data.name;
      let entity = entitiesRef.find((e) => e.type.name === entityName);

      if (!entity) {
        entity = EntityFactory.create(
          { name: entityName, endpoint },
          null,
          writeMethod.dependency,
          config,
          []
        );
        entities.push(entity);
      }

      if (build_interface) {
        const interface_result = this.buildAbstract(
          data,
          entity,
          entitiesRef,
          modelsRef
        );

        if (!interface_result) {
          continue;
        }

        repository = interface_result.repository;
        interface_result.models.forEach((m) => models.push(m));
        interface_result.entities.forEach((e) => entities.push(e));
        repositories.push(repository);
      }

      if (Array.isArray(contexts)) {
        for (const context of contexts) {
          let type;
          let source;
          let sourceName;
          let mapper;
          let mapperName;
          let model;
          let modelName;

          if (typeof context === "string") {
            type = context;
            sourceName = data.name;
            mapperName = data.name;
            modelName = data.name;
          } else {
            type = context.type;
            sourceName = context.source || data.name;
            mapperName = context.mapper || data.name;
            modelName = context.model || data.name;
          }

          model = modelsRef.find((s) => {
            return s.type.name === modelName;
          });
          if (!model) {
            model = ModelFactory.create(
              { name: modelName, endpoint, type },
              writeMethod.dependency,
              config,
              []
            );
            models.push(model);
          }

          source = sourcesRef.find((s) => s.type.name === sourceName);
          if (!source) {
            source = SourceFactory.create(
              {
                name: sourceName,
                endpoint,
                storage: type,
                table: paramCase(sourceName),
              },
              model,
              writeMethod.dependency,
              config
            );
            sources.push(source);
          }

          mapper = mappersRef.find((s) => s.type.name === mapperName);
          if (!mapper) {
            mapper = MapperFactory.create(
              { name: mapperName, endpoint, storage: type },
              entity,
              model,
              writeMethod.dependency,
              config
            );
            mappers.push(mapper);
          }

          ctxs.push({ model, mapper, source });
        }

        if (use_default_impl === false) {
          const impl_result = this.buildImpl(
            data,
            entity,
            ctxs,
            entitiesRef,
            modelsRef
          );
          impl = impl_result.impl;
          impl_result.models.forEach((m) => models.push(m));
          impl_result.entities.forEach((e) => entities.push(e));
          repository_impls.push(impl);
        }
      }

      if (build_factory) {
        const factory = this.buildFactory(data, repository, impl, ctxs);
        repository_factories.push(factory);
      }
    }

    return {
      repositories,
      repository_impls,
      repository_factories,
      models,
      entities,
      mappers,
      sources,
    };
  }
}
