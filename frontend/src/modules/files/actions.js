import { createDataAction } from '@src/modules/data/actions';

export const fetchFiles = createDataAction('files/get');

export const uploadFile = (file, filesKey) => ({
  type: 'file/upload',
  meta: {
    filesKey,
  },
  payload: file,
});

export const uploadFileProgress = (meta, progress) => ({
  type: 'file/upload/progress',
  meta,
  payload: progress,
});

export const uploadFileFailure = (meta, error) => ({
  type: 'file/upload/failed',
  meta,
  error: true,
  payload: error,
});

export const uploadFileSuccess = (meta, payload) => ({
  type: 'file/upload/success',
  meta,
  payload,
});

export const uploadFileReset = id => ({
  type: 'file/upload/reset',
  payload: id,
});

export default {
  fetchFiles,
  uploadFile,
  uploadFileProgress,
  uploadFileSuccess,
  uploadFileFailure,
  uploadFileReset,
};
