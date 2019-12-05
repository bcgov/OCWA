export const limit = 100;

export const socketHost = SOCKET_HOST;
export const requestSocketHost = REQUEST_SOCKET_HOST;
export const version = VERSION;
export const commit = COMMIT;
export const idField = ID_FIELD;
export const exporterGroup = EXPORTER_GROUP;
export const ocGroup = OC_GROUP;
export const reportsGroup = REPORTS_GROUP;
export const exporterMode = EXPORTER_MODE; // Can be (undefined || 'export') or 'download'
export const codeExportEnabled = CODE_EXPORT_ENABLED; // Can be (undefined || 'export') or 'download'
export const repositoryHost = REPOSITORY_HOST; // Can be (undefined || 'export') or 'download'
export const dataRequestForm = DATA_REQUEST_FORM;
export const codeRequestForm = CODE_REQUEST_FORM;
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
  reportsGroup,
  exporterMode,
  socketHost,
  repositoryHost,
  requestSocketHost,
  dataRequestForm,
  codeRequestForm,
  zone,
  getZone,
};
