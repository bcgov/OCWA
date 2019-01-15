import { call, take, takeLatest, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { getToken } from '@src/services/auth';
import has from 'lodash/has';
import get from 'lodash/get';

import { postSchema } from './schemas';

function createSocket() {
  const token = getToken();
  const socket = new WebSocket(SOCKET_HOST, token);
  socket.onopen = () => console.log('[SOCKET] connected');
  socket.onclose = () => console.log('[SOCKET] closed');
  return socket;
}

function createSocketChannel(socket, email) {
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

        if (authorUser !== email) {
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
  try {
    const socket = yield call(createSocket);
    const email = yield select(state => get(state, 'app.auth.user.email'));
    const channel = yield call(createSocketChannel, socket, email);

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
