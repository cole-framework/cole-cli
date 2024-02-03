#!/usr/bin/env node

import * as Commands from "./commands";
import Logger, { LogLevel } from "./core/tools/logger";

import commander from "commander";

const logger = Logger.getLogger({
  minLevel: LogLevel.Debug,
});

const program = new commander.Command();
program.description("Cole").enablePositionalOptions();

const config = program.command("config");

/**
 * API
 */
const newComponent = program.command("new");

newComponent
  .option("-f, --force", "", false)
  .option("-j, --json <value>", "path to the json")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .action((options) => Commands.Api.Actions.fromJson(options));

newComponent
  .command("model")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the model")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-t, --type [values...]", "json, mongo")
  .option("-p, --props [values...]", "prop1:string, prop2:number")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new model file based on provided data.")
  .action((options) => Commands.Api.Actions.newModel(options));

newComponent
  .command("entity")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the entity")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-p, --props [values...]", "prop1:string prop2:number")
  .option("-m, --model", "Include JSON model")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new entity file based on provided data.")
  .action((options) => Commands.Api.Actions.newEntity(options));

newComponent
  .command("toolset")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-n, --name <value>", "Name of the toolset")
  .option("-l, --layer <value>", "Domain, Data, Infra")
  .option(
    "-m, --methods [values...]",
    "method1(Array<string>):Output, handlerName2"
  )
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new controller file based on provided data.")
  .action((options) => Commands.Api.Actions.newToolset(options));

newComponent
  .command("mapper")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the data source")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --storage [values...]", "mongo")
  .option("-t, --entity <value>", "entity name")
  .option("-m, --model <value>", "model name")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new mapper file based on provided data.")
  .action((options) => Commands.Api.Actions.newMapper(options));

newComponent
  .command("use-case")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the use case")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-i, --input [values...]", "prop1:string prop2:number")
  .option("-o, --output <type>", "number")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new use case file based on provided data.")
  .action((options) => Commands.Api.Actions.newUseCase(options));

newComponent
  .command("source")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the data source")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --storage [values...]", "mongo")
  .option("-b, --table <value>", "table name")
  .option("-m, --model <value>", "model name")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new data source file based on provided data.")
  .action((options) => Commands.Api.Actions.newSource(options));

newComponent
  .command("repository")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the repository")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-t, --entity <value>", "(optional) Name of the entity")
  .option("-m, --model <value>", "model name")
  .option("-s, --storage [values...]", "mongo")
  .option("-w, --with-deps", "Include component dependencies")
  .option("-b, --bundle", "Include interface, implementation and factory")
  .option("-a, --abstract", "Include interface")
  .option("-p, --impl", "Include implementation")
  .option("-c, --factory", "Include factory")
  .option("--skip-tests", "Determines if tests should be included")
  .description("Creates new repository file based on provided data.")
  .action((options) => Commands.Api.Actions.newRepository(options));

newComponent
  .command("route")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the route")
  .option("-m, --method <value>", "Request method")
  .option("-p, --path <value>", "/qwerty/:foo?bar=1&baz=true")
  .option("-c, --controller <value>", "controller name")
  .option("-h, --handler <value>", "controller method name")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-a, --auth <value>", "jwt")
  .option("-v, --validate", "Include request validation")
  .option("-b, --body <value>", "Request body")
  .option("-r, --response <value>", "Response body")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new route file based on provided data.")
  .action((options) => Commands.Api.Actions.newRoute(options));

newComponent
  .command("controller")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option(
    "-n, --name <value>",
    "Name of the controller (If different then endpoint)"
  )
  .option(
    "-h, --handlers [values...]",
    "handlerName1(Array<string>):Output, handlerName2"
  )
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new controller file based on provided data.")
  .action((options) => Commands.Api.Actions.newController(options));

/**
 * Config
 */

config
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

config
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
