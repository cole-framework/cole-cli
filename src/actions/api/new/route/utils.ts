export const hasBody = (body: unknown) => {
  if (
    typeof body === "string" ||
    (typeof body === "object" && Object.keys(body).length > 0) ||
    (Array.isArray(body) && body.length > 0)
  ) {
    return true;
  }

  return false;
};

export const hasParams = (path: string) => {
  const [pathParams, queryParams] = path.split(/\s*\?\s*/);

  return /\:\w+/g.test(pathParams) && /\w+/g.test(queryParams);
};

export const extractParamsFromPath = (value: string) => {
  const result = { pathParams: [], queryParams: [] };
  const [pathParams, queryParams] = value.split(/\s*\?\s*/);

  const pathMatches = pathParams?.match(/\:\w+/g);
  const queryMatches = queryParams?.match(/\w+/g);

  if (pathMatches) {
    pathMatches.forEach((match) =>
      result.pathParams.push(match.replace(/\s*\:\s*/, ""))
    );
  }

  if (queryMatches) {
    queryMatches.forEach((match) => result.queryParams.push(match));
  }

  return result;
};
