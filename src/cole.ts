#!/usr/bin/env node

import * as Actions from "./actions";
import { GetConfigOptions, SetConfigOptions } from "./actions/config";

import Logger, { LogLevel } from "./core/tools/logger";

import commander from "commander";

const logger = Logger.getLogger({
  minLevel: LogLevel.Debug,
});

const program = new commander.Command();

program.description("Cole");

const config = program.command("config");

/**
 * API
 */
const newComponent = program.command("new");

newComponent
  // .option("-f, --force", "", false)
  // .option("-h, --here", "", false)
  // .option("-j, --json <value>", "path to the json")
  .action((options) => {
    console.log("AHA!");
  });

newComponent
  .command("model")
  .option("-j, --json <value>", "Path to the model configuration file.")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the model")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-t, --type [values...]", "json, mongo")
  .option("-p, --props [values...]", "prop1:string, prop2:number")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new model file based on provided data.")
  .action((options) => Actions.Api.newModel(options));

newComponent
  .command("entity")
  .option("-j, --json <value>", "Path to the entity configuration file.")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the entity")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-p, --props [values...]", "prop1:string prop2:number")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new entity file based on provided data.")
  .action((options) => Actions.Api.newEntity(options));

newComponent
  .command("mapper")
  .option("-j, --json <value>", "Path to the mapper configuration file.")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the data source")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-s, --storage [values...]", "mongo")
  .option("-t, --entity <value>", "entity name")
  .option("-m, --model <value>", "model name")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new mapper file based on provided data.")
  .action((options) => Actions.Api.newMapper(options));

newComponent
  .command("use-case")
  .option("-j, --json <value>", "Path to the use case configuration file.")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the use case")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-i, --input [values...]", "prop1:string prop2:number")
  .option("-o, --output <type>", "number")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new use case file based on provided data.")
  .action((options) => Actions.Api.newUseCase(options));

newComponent
  .command("source")
  .option("-j, --json <value>", "Path to the data source configuration file.")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the data source")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-t, --type [values...]", "mongo")
  .option("-b, --table <value>", "table name")
  .option("-m, --model <value>", "model name")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new data source file based on provided data.")
  .action((options) => Actions.Api.newSource(options));

newComponent
  .command("repository")
  .option("-j, --json <value>", "Path to the model configuration file.")
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
  .action((options) => Actions.Api.newRepository(options));

newComponent
  .command("route")
  .option("-j, --json <value>", "Path to the model configuration file.")
  .option("-f, --force", "Determines whether to overwrite existing files")
  .option("-n, --name <value>", "Name of the repository")
  .option("-m, --method <value>", "Request method")
  .option("-p, --path <value>", "/qwerty/:foo?bar=1&baz=true")
  .option("-h, --handler <value>", "handler_name.method_name")
  .option("-e, --endpoint <value>", "Name of the endpoint")
  .option("-a, --auth <value>", "jwt")
  .option("-v, --validate", "Include request validation")
  .option("-b, --body <value>", "Request body")
  .option("-r, --response <value>", "Response body")
  .option("--skip-tests", "Determines if tests should be included")
  .option("-w, --with-deps", "Include component dependencies")
  .description("Creates new route file based on provided data.")
  .action((options) => Actions.Api.newRoute(options));

newComponent
  .command("controller")
  .option("-j, --json <value>", "Path to the model configuration file.")
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
  .action((options) => Actions.Api.newController(options));

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
  .action((options: SetConfigOptions) => Actions.Config.setConfig(options));

config
  .command("get")
  .option("-k, --key <value>", "The name of the key.")
  .description(
    "This command is used to display a specific option or the entire configuration."
  )
  .action((options: GetConfigOptions) => Actions.Config.printConfig(options));

/**
 *
 */
program.parse(process.argv);

export default program;
