import {readFileSync} from 'fs';
import * as yaml from 'js-yaml';
import ono from 'ono';

/**
 * Returns the configuration settings that are particular to the given service.
 */
// eslint-disable-next-line
export function config(): any {
  const path = process.env.CONFIG_PATH;

  if (!path) {
    throw ono('No CONFIG_PATH set in env.');
  }

  return yaml.load(readFileSync(path, 'utf8'));
}

/**
 * Returns the configuration settings that are service agnostic. (In other words,
 * settings such as LOG level).
 */
// eslint-disable-next-line
export function baseConfig(): any {
  const path = process.env.BASE_CONFIG_PATH;

  if (!path) {
    throw ono('No BASE_CONFIG_PATH set in env.');
  }

  return yaml.load(readFileSync(path, 'utf8'));
}
