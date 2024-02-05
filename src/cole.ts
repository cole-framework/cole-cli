#!/usr/bin/env node

import * as Commands from "./commands";
import commander from "commander";
import { Texts } from "./core";

const texts = Texts.load();

const program = new commander.Command();
program.description("Cole").enablePositionalOptions();

const configCommand = program.command("config");
const initCommand = program.command("init");
const newCommand = program.command("new");
/**
 * INIT
 */
initCommand
  .option("-l, --lang <value>", texts.get("option_project_lang"))
  .option("-s, --source <value>", texts.get("option_project_source"))
  .option("-d, --database [values...]", texts.get("option_project_databases"))
  .description(texts.get("description_project_init"))
  .action((options) => Commands.Base.init(options));

/**
 * NEW PROJECT
 */
newCommand
  .command("project")
  .option("-n, --name <value>", texts.get("option_project_name"))
  .option("-l, --lang <value>", texts.get("option_project_lang"))
  .option("-s, --source <value>", texts.get("option_project_source"))
  .option("-f, --framework <value>", texts.get("option_project_framework"))
  .option("-d, --database [values...]", texts.get("option_project_databases"))
  .description(texts.get("description_new_project"))
  .action((options) => Commands.Base.newProject(options));

/**
 * API
 */
newCommand
  .option("-f, --force", texts.get("option_force"))
  .option("-j, --json <value>", texts.get("option_json"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_components"))
  .action((options) => Commands.Api.Actions.fromJson(options));

newCommand
  .command("model")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-t, --type [values...]", texts.get("option_model_type"))
  .option("-p, --props [values...]", texts.get("option_model_props"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_model"))
  .action((options) => Commands.Api.Actions.newModel(options));

newCommand
  .command("entity")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-p, --props [values...]", texts.get("option_entity_props"))
  .option("-m, --with-model", texts.get("option_entity_with_model"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_entity"))
  .action((options) => Commands.Api.Actions.newEntity(options));

newCommand
  .command("toolset")
  .option("-f, --force", texts.get("option_force"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-l, --layer <value>", texts.get("option_toolset_layer"))
  .option("-m, --methods [values...]", texts.get("option_toolset_methods"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_toolset"))
  .action((options) => Commands.Api.Actions.newToolset(options));

newCommand
  .command("mapper")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-s, --storage [values...]", texts.get("option_mapper_storages"))
  .option("-t, --entity <value>", texts.get("option_mapper_entity"))
  .option("-m, --model <value>", texts.get("option_mapper_model"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_mapper"))
  .action((options) => Commands.Api.Actions.newMapper(options));

newCommand
  .command("use-case")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-i, --input [values...]", texts.get("option_use_case_input"))
  .option("-o, --output <type>", texts.get("option_use_case_output"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_use_case"))
  .action((options) => Commands.Api.Actions.newUseCase(options));

newCommand
  .command("source")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-s, --storage [values...]", texts.get("option_source_storages"))
  .option("-b, --table <value>", texts.get("option_source_table"))
  .option("-m, --model <value>", texts.get("option_source_model_name"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_source"))
  .action((options) => Commands.Api.Actions.newSource(options));

newCommand
  .command("repository")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-t, --entity <value>", texts.get("option_repository_entity"))
  .option("-m, --model <value>", texts.get("option_repository_model"))
  .option("-s, --storage [values...]", texts.get("option_repository_storages"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .option("-a, --no-interface", texts.get("option_repository_no_interface"))
  .option("-i, --no-impl", texts.get("option_repository_no_impl"))
  .option("-t, --no-factory", texts.get("option_repository_no_factory"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .description(texts.get("description_new_repository"))
  .action((options) => Commands.Api.Actions.newRepository(options));

newCommand
  .command("route")
  .option("-f, --force", texts.get("option_force"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-m, --method <value>", texts.get("option_route_method"))
  .option("-p, --path <value>", texts.get("option_route_path"))
  .option("-c, --controller <value>", texts.get("option_route_controller"))
  .option("-h, --handler <value>", texts.get("option_route_handler"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-a, --auth <value>", texts.get("option_route_auth"))
  .option("-v, --validate", texts.get("option_route_validate"))
  .option("-b, --body <value>", texts.get("option_route_body"))
  .option("-r, --response <value>", texts.get("option_route_reposnse"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_route"))
  .action((options) => Commands.Api.Actions.newRoute(options));

newCommand
  .command("controller")
  .option("-f, --force", texts.get("option_force"))
  .option("-e, --endpoint <value>", texts.get("option_endpoint"))
  .option("-n, --name <value>", texts.get("option_name"))
  .option("-h, --handlers [values...]", texts.get("option_controller_handlers"))
  .option("--skip-tests", texts.get("option_skip_tests"))
  .option("-w, --with-deps", texts.get("option_with_deps"))
  .description(texts.get("description_new_controller"))
  .action((options) => Commands.Api.Actions.newController(options));

/**
 * CONFIG
 */
configCommand
  .command("set")
  .option("-g, --global", "", false)
  .option("-d, --default", "", false)
  .option("-p, --path <value>", "Path to the config file.")
  .option("-k, --key <value>", "The name of the key whose value is to be set.")
  .option(
    "-v, --value <value>",
    "The new value for the given key. Requires the --key options."
  )
  .description(
    "This command is used to set individual option values or the entire configuration."
  )
  .action((options: Commands.Config.Actions.SetConfigOptions) =>
    Commands.Config.Actions.setConfig(options)
  );

configCommand
  .command("get")
  .option("-k, --key <value>", "The name of the key.")
  .description(
    "This command is used to display a specific option or the entire configuration."
  )
  .action((options: Commands.Config.Actions.PrintConfigOptions) =>
    Commands.Config.Actions.printConfig(options)
  );

/**
 *
 */
program.parse(process.argv);

export default program;
