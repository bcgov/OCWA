import { put, select, takeLatest } from 'redux-saga/effects';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import mapValues from 'lodash/mapValues';
import union from 'lodash/union';
import values from 'lodash/values';

import { fetchRequest, saveRequest } from './actions';
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

  if (id) {
    action.meta.history.push(`/requests/${id}`, { isEditing: true });
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

function submitRequest(requestId) {
  return saveRequest(
    null,
    { requestId, dataType: 'requests', schema: { result: requestSchema } },
    {
      url: `/api/v1/requests/submit/${requestId}`,
    }
  );
}

function checkRequestForPending(fileStatus = {}) {
  const pendingFilesCheck = mapValues(fileStatus, value =>
    value.every(d => d.state === 2)
  );
  const isRequestFilesPending = values(pendingFilesCheck).every(
    d => d === true
  );

  return isRequestFilesPending;
}

// If the user uploads files and tries to submit right away the request could fail
// until the files are validated, this is a refresher to make sure the user
// sees the most up-to-date status of their files
function* refreshRequest(action) {
  const requestId = action.payload._id;
  const isRequestFilesPending = checkRequestForPending(
    action.payload.fileStatus
  );

  if (isRequestFilesPending) {
    yield put(
      fetchRequest(
        null,
        { isSubmitting: true },
        {
          url: `/api/v1/requests/${requestId}`,
          schema: requestSchema,
          id: requestId,
        }
      )
    );
  } else {
    yield put(submitRequest(requestId));
  }
}

function* requestReadyForSubmitWatcher(action) {
  if (action.meta.isSubmitting) {
    const requestId = action.payload.result;
    const fileStatus = get(
      action,
      `payload.entities.${requestId}.fileStatus`,
      {}
    );
    const isRequestFilesPending = checkRequestForPending(fileStatus);

    if (isRequestFilesPending) {
      yield put({
        type: 'request/submit/failed',
        error: true,
        payload: {
          message:
            'There are still files pending. Please wait a few minutes and try submitting again',
        },
      });
    } else {
      yield put(submitRequest(requestId));
    }
  }
}

export default function* root() {
  yield takeLatest('request/post/success', onCreateRequest);
  yield takeLatest('request/put/success', onSaveRequest);
  yield takeLatest('request/finish-editing', onFinishEditing);
  yield takeLatest('request/submit', refreshRequest);
  yield takeLatest('request/get/success', requestReadyForSubmitWatcher);
}
