import { call, take, takeLatest, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { getToken } from '@src/services/auth';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import { socketHost, idField } from '@src/services/config';

import { postSchema } from './schemas';

function createSocket() {
  const token = getToken();
  const socket = new WebSocket(socketHost, token);
  socket.onopen = () => console.log('[SOCKET] connected');
  socket.onclose = () => console.log('[SOCKET] closed');
  return socket;
}

function createSocketChannel(socket, username) {
  return eventChannel(emit => {
    socket.onmessage = event => {
      const parsedJson = JSON.parse(event.data);
      const json = camelizeKeys(parsedJson, {
        process(key, convert, options) {
          return key === '_id' ? key : convert(key, options);
        },
      });

      if (has(json, 'comment')) {
        const { topicId, authorUser } = json.comment;

        if (authorUser !== username) {
          const payload = normalize(json.comment, postSchema);

          emit({
            payload,
            meta: {
              dataType: 'posts',
              topicId,
            },
          });
        }
      }
    };

    const unsubscribe = () => socket.close();

    return unsubscribe;
  });
}

function* authWatcher() {
  if (isEmpty(socketHost.replace(/wss?:\/\//, ''))) return;

  try {
    const socket = yield call(createSocket);
    const user = yield select(state => get(state, 'app.auth.user', {}));
    const email = get(user, 'email', '');
    const username = get(user, idField, email);
    const channel = yield call(createSocketChannel, socket, username);

    while (true) {
      const { payload, meta } = yield take(channel);
      yield put({ type: 'discussion/posts/post/success', payload, meta });
    }
  } catch (err) {
    throw new Error(err);
  }
}

export default function* root() {
  yield takeLatest('discussion/socket/init', authWatcher);
}
