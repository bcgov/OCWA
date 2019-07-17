export const limit = 100;

export const socketHost = SOCKET_HOST;
export const version = VERSION;
export const commit = COMMIT;
export const idField = ID_FIELD;
export const exporterGroup = EXPORTER_GROUP;
export const ocGroup = OC_GROUP;
export const exporterMode = EXPORTER_MODE; // Can be (undefined || 'export') or 'download'
export const codeExportEnabled = CODE_EXPORT_ENABLED; // Can be (undefined || 'export') or 'download'
export const zone = ZONE;
export const helpURL = HELP_URL;
export const getZone = () => ZONE;

export default {
  codeExportEnabled,
  commit,
  limit,
  version,
  helpURL,
  idField,
  exporterGroup,
  ocGroup,
  exporterMode,
  socketHost,
  zone,
  getZone,
};
