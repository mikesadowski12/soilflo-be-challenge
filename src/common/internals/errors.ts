type ErrorObject = {
  name?: string,
  error?: unknown,
  method?: string,
  time?: string,
  material? : string,
}

class AbstractMethod extends Error {
  constructor() {
    super('Abstract method called');
  }
}

class ApiError extends Error {
  public httpStatus = 500;
  public httpHeaders = {};
  public details: ErrorObject | object;

  constructor(details: ErrorObject|null, message: string) {
    const { error, ..._details } = details || {};
    // @ts-expect-error ignore
    super(message, { cause: error });
    this.details = _details;
  }
}

class ConfigError extends ApiError {}

class BadRequestError extends ApiError {
  httpStatus = 400;

  /**
   * @param {object} [details]
   * @param {string} [message]
   */
  constructor(details: ErrorObject|null, message: string) {
    super(details, message || 'Bad Request');
  }
}

class ConflictError extends ApiError {
  httpStatus = 409;

  /**
   * @param {object} [details]
   * @param {string} [message]
   */
  constructor(details: ErrorObject|null, message: string) {
    super(details, message || 'Conflict');
  }
}

export {
  AbstractMethod,
  ApiError,
  ConfigError,
  BadRequestError,
  ConflictError,
}
