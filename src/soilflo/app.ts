import { env, exit } from 'process';
import * as path from 'path';

import {
  Application,
  Logger,
  Health,
  ConfigError,
} from '../common';

import { LocalConfig } from './config';
import { Backend, Postgres } from './backend';
import { Kernel } from './kernel';
import { Api } from './api';

function local(): Application {
  const config = new LocalConfig();
  const logger = new Logger(config, 'SoilFlo API');
  const health = new Health(config, logger);
  const application = new Application(config, logger, health);

  const postgres = new Postgres(application);
  const backend = new Backend(application, postgres);

  const kernel = new Kernel(application, backend);

  new Api(application, backend, kernel);

  return application;
}

function setup() {
  try {
    switch (env.DEPLOYMENT) {
      case 'local':
        require('dotenv').config({ path: path.resolve(`${process.cwd()}/src/soilflo`, '.env') }); // eslint-disable-line @typescript-eslint/no-require-imports
        return local();
      default:
        require('dotenv').config({ path: path.resolve(`${process.cwd()}/src/soilflo`, '.env') }); // eslint-disable-line @typescript-eslint/no-require-imports
        return local();
    }
  } catch (error: unknown) {
    if (error instanceof ConfigError) {
      console.error(error.message, error.details);
      console.error('Aborting');
      exit(1);
    }

    throw error;
  }
}

async function main() {
  console.log('SoilFlo API service starting');
  const deployment = setup();
  await deployment.run();
}

if (require.main === module) {
  main();
}

export {
  local,
};
