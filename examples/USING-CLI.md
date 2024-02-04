# Using Cole CLI tools

## Before you start

**A general note for all components.** 
_1. Do not use the component type in the name, e.g. Model, Entity, Repository etc. The names are created based on the pattern in the general configuration file. If you have not changed this configuration, the names will be formulated taking into account the type of component (the exception is Entity). Remember that you can modify the configuration file and define this pattern and name the components whatever you want._

_2. In certain places, the application creates components according to guidelines defined in the code. If, for example, you want to use a specific type of component, like model or entity, as a parameter type, you must embed the name in an appropriate tag, e.g. Model<User> or Entity<User>. In the case of components that depend on the type of data provider, e.g. Model, RouteModel, Source. Tags may contain additional information, e.g. Model<User, mongo> (will create a model with properties appropriate for the mongo database)_

### Basic JSON Structures

Each json structure uses the following fully or partially as they are part of the components.

#### Property (Prop) JSON Structure:

```json
{
  "name": "string",
  "type": "string",
  "access": "string",
  "is_optional": "boolean",
  "is_readonly": "boolean",
  "is_static": "boolean",
  "value": "unknown",
}
```

#### Parameter (Param) JSON Structure:

```json
{
  "name": "string",
  "type": "string",
  "access": "string",
  "is_optional": "boolean",
  "is_readonly": "boolean",
  "value": "unknown",
}
```

#### Method JSON Structure:

```json
{
  "access": "string",
  "name": "string",
  "return_type": "string",
  "is_async": "boolean",
  "is_static": "boolean",
  "params": "string | (ParamJson | string)[]",
  "body": "string",
  "supr": "MethodJson",
  "generics": "(GenericJson | string)[]",
  "prompt": "string",
}
```

#### Function JSON Structure:

```json
{
  "exp":" string | boolean | ExportJson",
  "name":" string",
  "return_type":" string",
  "is_async":" boolean",
  "params":" (ParamJson | string)[]",
  "body":" string",
  "generics":" (GenericJson | string)[]",
}
```

#### Generic JSON Structure:

```json
{
  "name": "string",
  "inheritance": "string",
  "dflt": "string"
}
```

* `inheritance` - extends types, may use multiple with & or |
* `dflt` - default type, may use multiple with & or |

_You can find more information in the code in the types.ts files_

## Getting Started

Before diving into component creation, ensure the CLI tool is installed and properly configured in your environment. This tool offers flexibility in component generation through three primary methods:

### 1. JSON File Configuration

Define your component configurations in a JSON file. 

```shell
cole new --json "./examples/new-repository.json" --with-deps
```

This approach requires familiarity with the JSON structure for each component type. Here's a brief overview:

#### Models JSON Structure:

```json
{
  "name": "ModelName",
  "endpoint": "associatedEndpoint",
  "types": ["ModelType"],
  "props": [
    {"name": "propertyName", "type": "propertyType"}, 
    "propertyName:propertyType"
  ]
}
```
* `types` - Specifies what types the model is. By default it is json but depending on the database used it can be mongo, thought or several at once if you know you will need all of them. You can define an array of strings or objects.

#### Entities JSON Structure:

```json
{
  "name": "EntityName",
  "endpoint": "associatedEndpoint",
  "has_model": false,
  "props": [
    {"name": "propertyName", "type": "propertyType"}
  ]
}
```
* `has_model` - specifies whether a json model should also be created for the entity (used in the `toObject()` method).

#### Mappers JSON Structure:

```json
{
  "name": "MapperName",
  "endpoint": "associatedEndpoint",
  "storages": [
    "dbType"
  ],
  "model": "ModelName",
  "entity": "EntityName"
}
```
* `storages` - By specifying several types of databases, you will create mappers for all of them at once
* `model`/`entity` - if you do not provide these values, the model and entity will have the same (root) name as the mapper. Therefore, you should not include types in the component name to avoid names like UserMapperModel.


#### Controllers JSON Structure:

```json
{
  "name": "ControllerName",
  "endpoint": "associatedEndpoint",
  "handlers": [
    {
      "name": "MethodName",
      "input": "MethodInputType",
      "output": "MethodOutputType"
    }
  ]
}
```

* input/output - you can provide a string with a name or an object with properties and their types. Then the script will create the appropriate entities. Input/Output are optional, without providing them the controller will not accept data and will only return Result.withoutContent

#### Repositories JSON Structure:

```json
{
  "name": "RepositoryName",
  "endpoint": "associatedEndpoint",
  "methods": ["additionalMethodName"],
  "entity": "EntityName",
  "contexts": [
    {
      "type": "DatabaseType",
      "source": "SourceName",
      "mapper": "MapperName",
      "model": "ModelName"
    }
  ]
}
```
* methods - If you want, you can add additional methods to the repository
* contexts - responsible for determining the type of databases the repository uses (yes, you can add several - create a cluster). For this reason, you can provide database types as strings or describe them more precisely by providing specific names for components in the Data, model, source, and mapper layers. If you do not provide a name, the repository name will be used

#### Sources JSON Structure:

```json
{
  "name": "SourceName",
  "endpoint": "associatedEndpoint",
  "storages": ["DatabaseType"],
  "model": "ModelName",
  "table": "TableName"
}
```
* storages - By specifying several types of databases, you can create all sources at once
* table - table name in the database. if you create several sources at once, this name will be used in all of them, adjust it in the code if necessary

#### Use Cases JSON Structure:

```json
{
  "name": "UseCaseName",
  "endpoint": "associatedEndpoint",
  "input": [
    {
      "name": "InputName",
      "type": "InputType"
    }
  ],
  "output": "OutputType"
}
```
* input - is nothing more than an array of objects or strings as in the case of params in a method
* output - is the value returned from the use case method. It is nothing else than the return_type in MethodJSON

#### Routes JSON Structure:

```json
{
  "name": "RouteName",
  "endpoint": "associatedEndpoint",
  "request": {
    "method": "HTTPMethod",
    "path": "routePath",
    "auth": "AuthType",
    "validate": "ShouldValidateRequest",
    "body": "RequestBodyType",
  },
  "response": {
    "[StatusNumber]": "ResponseType",
  }
}
```
* `auth` - specifies the type of authorization, the default is "none".
* `validate` - specifies whether the request should be validated before passing data to `routeIO`
* `body` - You can specify whether the body will contain any data, whether it will be a specific or primitive type, or an object with properties and type. The script will create the appropriate `RouteModel`
* `[StatusNumber]` - The response may vary depending on the execution status of the request. You can provide the status number and a string with the type name or define concrete object with props and types. In that case the script will create a `RouteModel`

Use the `-j` or `--json` option to specify the JSON file path when creating a component.

### 2. Command Line Options

Create components directly using the CLI with specific options. This method is efficient for quickly generating individual components.

#### Examples:

```shell
cole new model -n UserProfile -e user -t json -p "userId:string, userName:string, userEmail:string" -w
cole new entity -n Product -e product -p "productId:string productName:string price:number" -m -w
cole new mapper -n Order -e order -s mongo -t Order -m Order -w
cole new use-case -n PlaceOrder -e order -i "orderItems:Array<Entity<Product>>, customerDetails:Customer, paymentMethod:string" -o "OrderConfirmation" -w
cole new source -n User -e user -s mongo -b "users.collection" -m User -w
cole new repository -n Product -e product -m Product -s mongo -w
cole new route -n getUserProfile -e user -m GET -p "/userProfile/:userId" -c UserProfileController -h getUserProfile -a jwt -v -b "userId:string" -r "{'200': 'UserProfile', '404': 'Error'}" -w
cole new controller -n User -e user -h "createUser(Array<string>):User, deleteUser(string):boolean" -w
cole new toolset -n UserManagement -e user -l Domain -m "createUser(Array<string>):User, deleteUser(string):boolean" -w
```

### 3. Interactive CLI Form

For a guided component creation process, use the interactive form by running the command without specific options or with only general options like `-f`, `--skip-tests`, and `-w`.

#### Example:

```shell
cole new controller
```

This method prompts you to answer questions step-by-step to define the component you're creating.

### Upcoming Feature: AI-Powered Prompt

An AI-powered prompt feature is in development, promising to offer intelligent suggestions and further streamline the component creation process.

## Component Creation Overview

Here's how to create various components with the CLI tool:

- **Models**: Define data structures.
- **Entities**: Specify business entities.
- **Toolsets**: Group related functionalities.
- **Mappers**: Map data between your app and databases.
- **Use Cases**: Implement business rules.
- **Sources**: Configure data sources.
- **Repositories**: Abstract the data layer.
- **Routes**: Define application routing.
- **Controllers**: Handle data flow and user input.

## Conclusion

This CLI tool is crafted to enhance your productivity, allowing you to scaffold your application's architecture efficiently. Whether you prefer JSON configurations, direct command line options, or interactive prompts, this tool caters to your preferred workflow.

For more detailed information on each command and its options, use the help command:

```shell
cole new --help
```

Happy coding!
