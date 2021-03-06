import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import { camelizeKeys } from 'humps';
import { delay, eventChannel } from 'redux-saga';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { normalize } from 'normalizr';
import union from 'lodash/union';
import { requestSocketHost } from '@src/services/config';
import { createSocket } from '@src/utils';
import { getToken } from '@src/services/auth';

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

function isPendingMergeRequest(request) {
  const isCodeExport = request.exportType === 'code';

  if (isCodeExport) {
    const code = get(request, 'mergeRequestStatus.code', 0);
    const isCurrentRequest = window.location.pathname.includes(request._id);
    return code < 200 && isCurrentRequest;
  }

  return isCodeExport;
}

/**
   Create and socket functions
 */
let socket = null;
function createSocketChannel(requestSocket) {
  return eventChannel(emit => {
    requestSocket.onmessage = event => {
      console.log(`[SOCKET] data - ${event.data}`);
      const json = JSON.parse(event.data);
      const { fileId, ...statusProps } = camelizeKeys(json, {
        process(key, convert, options) {
          return key === '_id' ? key : convert(key, options);
        },
      });
      const fileStatus = {
        [fileId]: [statusProps],
      };

      emit({
        fileId,
        fileStatus,
      });
    };

    const unsubscribe = () => {
      requestSocket.close();
      socket = null;
    };

    return unsubscribe;
  });
}

export function* fileImportWatcher() {
  if (isEmpty(requestSocketHost.replace(/wss?:\/\//, ''))) return;

  socket = yield call(createSocket, requestSocketHost);
  const channel = yield call(createSocketChannel, socket);

  try {
    while (true) {
      const { fileId, fileStatus } = yield take(channel);
      const results = yield select(state =>
        get(state, 'data.entities.requests', {})
      );

      let resultId = null;

      forIn(results, (value, key) => {
        if (value.files.includes(fileId)) {
          resultId = key;
        }
      });

      if (resultId) {
        const payload = normalize(
          {
            _id: resultId,
            fileStatus,
          },
          requestSchema
        );
        yield put({ type: 'request/processed/success', payload });
      }
    }
  } catch (err) {
    throw new Error(err);
  }
}

function onRefreshToken() {
  const token = getToken();
  if (socket) {
    socket.send(JSON.stringify({ access_token: token }));
  }
}

function* onCreateRequest(action) {
  const id = get(action, 'payload.result.result');
  const request = get(action.payload, `entities.requests.${id}`, {});
  const duplicateFiles = get(action, 'meta.files', {});

  if (id) {
    action.meta.history.push(`/requests/${id}`, {
      isEditing: true,
      duplicateFiles,
    });
    yield put({
      type: 'request/duplicate/files',
      payload: duplicateFiles,
    });

    if (isPendingMergeRequest(request)) {
      yield call(delay, 30000);
      yield put(
        fetchRequest({
          url: `/api/v2/requests/${id}`,
          schema: requestSchema,
          id,
        })
      );
    }
  }
}

function* checkMergeRequestStatus(action) {
  const { id } = action.meta;
  const request = get(action.payload, `entities.requests.${id}`, {});

  if (isPendingMergeRequest(request)) {
    yield call(delay, 30000);
    yield put(
      fetchRequest({
        url: `/api/v2/requests/${id}`,
        schema: requestSchema,
        id,
      })
    );
  }
}

// After a request is finished being edited normalize the added/removed files
function* onFinishEditing(action) {
  // Grab the uploaded files to add to the request
  const { id } = action.meta;
  const { files, supportingFiles } = yield select(
    state => state.files.fileTypes
  );
  const request = yield select(state =>
    get(state, `data.entities.requests.${id}`, {})
  );
  const { filesToDelete, filesToDuplicate } = yield select(
    state => state.requests.viewState
  );
  const deletedFilesHandler = fileId => !filesToDelete.includes(fileId);
  const payload = {
    ...request,
    ...action.payload,
    files: union(request.files, files, filesToDuplicate.files).filter(
      deletedFilesHandler
    ),
    supportingFiles: union(
      request.supportingFiles,
      supportingFiles,
      filesToDuplicate.supportingFiles
    ).filter(deletedFilesHandler),
  };
  const meta = { id };

  if (!isEqual(request, payload) || payload.state === 0) {
    yield put(
      saveRequest(payload, meta, {
        url: `/api/v2/requests/save/${id}`,
        schema: { result: requestSchema },
      })
    );
  }
}

export default function* root() {
  yield takeLatest('sockets/init', fileImportWatcher);
  yield takeLatest('app/get/refresh-token/success', onRefreshToken);
  yield takeLatest('request/post/success', onCreateRequest);
  yield takeLatest('request/put/success', onSaveRequest);
  yield takeLatest('request/finish-editing', onFinishEditing);
  yield takeLatest('request/get/success', checkMergeRequestStatus);
}
