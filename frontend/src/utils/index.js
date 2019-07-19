import get from 'lodash/get';
import template from 'lodash/template';
import { getZone } from '@src/services/config';

export const getZoneString = options => {
  const zone = getZone();
  return get(options, zone, '');
};

const interpolate = /{([\s\S]+?)}/g;

const strings = {
  internal: {
    Files: 'Output',
    request: 'export',
    Request: 'Export',
    Data: 'Aggregated Data Export (including notes/documentation)',
    download: 'import',
    Download: 'Import',
    Direction: 'Output',
    direction: 'direction',
  },
  external: {
    Files: 'Input',
    request: 'import',
    Request: 'Import',
    Data: 'Other Import (e.g., documentation, code lists)',
    download: 'export',
    Download: 'Export',
    Direction: 'Input',
    direction: 'input',
  },
};

export const _e = str => {
  const zone = getZone();
  const data = strings[zone];
  const keys = Object.keys(data);
  const compiled = template(str, {
    interpolate,
  });

  if (!keys.find(k => str.search(`{${k}}`) > -1)) return str;

  return compiled(data);
};

export default {
  _e,
  getZoneString,
};
