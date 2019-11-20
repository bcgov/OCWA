import get from 'lodash/get';
import template from 'lodash/template';
import { getZone } from '@src/services/config';
import { getToken } from '@src/services/auth';

const interpolate = /{([\s\S]+?)}/g;
// Add this for cases where we pass a zone lookup key, but want the request type equivalent
const internal = {
  Files: 'Output',
  request: 'export',
  Request: 'Export',
  Data: 'Aggregated Data Export (including notes/documentation)',
  download: 'import',
  Download: 'Import',
  Direction: 'Output',
  direction: 'direction',
};
const external = {
  Files: 'Input',
  request: 'import',
  Request: 'Import',
  Data: 'Other Import (e.g., documentation, code lists)',
  download: 'export',
  Download: 'Export',
  Direction: 'Input',
  direction: 'input',
};

const strings = {
  external,
  internal,
  import: external,
  export: internal,
};

/* eslint-disable no-dangle */
export const _e = (str, typeOverride) => {
  const zone = typeOverride || getZone();
  const data = strings[zone];
  const keys = Object.keys(data);
  const compiled = template(str, {
    interpolate,
  });

  if (!keys.find(k => str.search(`{${k}}`) > -1)) return str;

  return compiled(data);
};
/* eslint-enable no-dangle */

const requestTypeDictionary = {
  import: 'external',
  export: 'internal',
};
export const getZoneString = (options, typeOverride) => {
  const zone = get(requestTypeDictionary, typeOverride) || getZone();
  return get(options, zone, '');
};

export function createSocket(socketHost) {
  const token = getToken();
  const socket = new WebSocket(socketHost, token);
  socket.onopen = () => console.log(`[SOCKET] ${socketHost} connected`);
  socket.onclose = () => console.log(`[SOCKET] ${socketHost} closed`);
  return socket;
}
