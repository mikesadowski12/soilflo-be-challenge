import { env } from 'process';
import { ConfigError, LogLevel } from '../internals';

function _getEnv(name: string, mandatory: boolean) {
  const raw = env[name];
  if (!raw && mandatory) {
    throw new ConfigError({ name }, 'Missing environment variable');
  }
  return raw;
}

function envString(name: string, defaultValue: string): string {
  const raw = _getEnv(name, defaultValue === undefined);
  return raw || defaultValue;
}

function envInteger(name: string, defaultValue: number): number {
  try {
    const raw = _getEnv(name, defaultValue === undefined);
    const result = raw ? parseInt(raw, 10) : defaultValue;
    if (Number.isNaN(result)) {
      throw new Error('Environment variable is not an integer');
    }
    return result;
  } catch (error) {
    throw new ConfigError({ name, error }, 'Environment variable expected to be an integer');
  }
}

function envBoolean(name: string, defaultValue: boolean): boolean {
  try {
    const raw = _getEnv(name, defaultValue === undefined);
    if (!raw) {
      return defaultValue;
    }
    const result = raw.toLowerCase() === 'true' || raw.toLowerCase() === 'false';
    if (!result) {
      throw new Error('Environment variable is not a boolean');
    }
    return result;
  } catch (error) {
    throw new ConfigError({ name, error }, 'Environment variable expected to be a boolean');
  }
}

function envLogLevel(name: string, defaultValue: LogLevel): LogLevel {
  try {
    const raw = _getEnv(name, defaultValue === undefined);
    if (!raw) {
      return defaultValue;
    }
    // @ts-expect-error ignore
    if (!Object.values(LogLevel).includes(raw.toLowerCase())) {
      throw new Error('Environment variable is not a valid log level');
    }
    // @ts-expect-error ignore
    return LogLevel[raw.toUpperCase()];
  } catch (error) {
    throw new ConfigError({ name, error }, 'Environment variable expected to be a log level');
  }
}

function envHexBuffer(name: string, defaultValue: Buffer): Buffer {
  try {
    const raw = _getEnv(name, defaultValue === undefined);
    const result = raw ? Buffer.from(raw, 'hex') : defaultValue;
    if (!result || (raw && !result.length)) {
      throw new Error('Environment variable is not a a buffer');
    }
    return result;
  } catch (error) {
    throw new ConfigError({ name, error }, 'Environment variable expected to be a hex buffer');
  }
}

export {
  envString,
  envInteger,
  envBoolean,
  envLogLevel,
  envHexBuffer,
}