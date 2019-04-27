import { put, select, takeLatest } from 'redux-saga/effects';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import union from 'lodash/union';

import { saveRequest } from './actions';
import { requestSchema } from './schemas';

function* onSaveRequest(action) {
  const { id, isWithdrawing } = action.meta;

  if (isWithdrawing) {
    yield put({
      type: 'requests/view/request',
      payload: id,
    });
  }
}

function onCreateRequest(action) {
  const id = get(action, 'payload.result.result');
  const duplicateFiles = get(action, 'meta.files', {});

  if (id) {
    action.meta.history.push(`/requests/${id}`, {
      isEditing: true,
      duplicateFiles,
    });
  }
}

// After a request is finished being edited normalize the added/removed files
function* onFinishEditing(action) {
  // Grab the uploaded files to add to the request
  const id = action.payload;
  const { files, supportingFiles } = yield select(
    state => state.files.fileTypes
  );
  const request = yield select(state =>
    get(state, `data.entities.requests.${id}`, {})
  );
  const { filesToDelete } = yield select(state => state.requests.viewState);
  const deletedFilesHandler = fileId => !filesToDelete.includes(fileId);
  const payload = {
    ...request,
    files: union(request.files, files).filter(deletedFilesHandler),
    supportingFiles: union(request.supportingFiles, supportingFiles).filter(
      deletedFilesHandler
    ),
  };
  const meta = { id };

  if (!isEqual(request, payload)) {
    yield put(
      saveRequest(payload, meta, {
        url: `/api/v1/requests/save/${id}`,
        schema: { result: requestSchema },
      })
    );
  }
}

export default function* root() {
  yield takeLatest('request/post/success', onCreateRequest);
  yield takeLatest('request/put/success', onSaveRequest);
  yield takeLatest('request/finish-editing', onFinishEditing);
}
