export enum IncludeType {
  None = "none",
  All = "all",
  DependencyInjector = "dependency_injector",
  Controller = "controller",
  Source = "collection_source",
  Endpoint = "endpoint",
  Entity = "entity",
  Enum = "enum",
  Input = "input",
  Mapper = "mapper",
  Model = "model",
  Output = "output",
  QueryBuilder = "query_builder",
  Repository = "repository",
  Route = "route",
  Schema = "schema",
  Service = "service",
  UseCase = "use_case",
}

export enum WriteMethod {
  Ask = "ask",
  Skip = "skip",
  Write = "write",
  Overwrite = "overwrite",
  Patch = "patch",
}

export enum RouteModelLabel {
  Input = "input",
  Output = "output",
  PathParams = "path_params",
  QueryParams = "query_params",
  RequestBody = "request_body",
  ResponseBody = "response_body",
  ResponseStatusBody = "response_status_body",
}

export enum CaseFormat {
  Kebab = "kebab",
  Param = "param",
  Pascal = "pascal",
  Camel = "camel",
}

export enum AccessType {
  Public = "public",
  Protected = "protected",
  Private = "private",
}

export enum RouteMethodType {
  Get = "get",
  Put = "put",
  Post = "post",
  Delete = "delete",
}

export enum RouteAuthType {
  None = "none",
  Basic = "basic",
  Bearer = "jwt",
  MAC = "mac",
  ApiKey = "api_key",
}

export enum BasicType {
  Any = "any",
  Array = "array",
  Map = "map",
  Set = "set",
  Object = "object",
  Number = "number",
  String = "string",
  Boolean = "boolean",
  Unknown = "unknown",
  Void = "void",
  Null = "null",
  NaN = "nan",
}
