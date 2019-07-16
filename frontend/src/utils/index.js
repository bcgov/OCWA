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
    download: 'import',
    Download: 'Import',
  },
  external: {
    Files: 'Input',
    request: 'import',
    Request: 'Import',
    download: 'export',
    Download: 'Export',
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
