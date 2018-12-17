import { call, take, takeLatest, put, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { getToken } from '@src/services/auth';

import { postSchema } from './schemas';

function createSocket() {
  const token = getToken();
  const socket = new WebSocket(SOCKET_HOST, token);
  socket.onopen = () => console.log('[SOCKET] connected');
  socket.onclose = () => console.log('[SOCKET] closed');
  return socket;
}

function createSocketChannel(socket) {
  return eventChannel(emit => {
    socket.onmessage = event => {
      const parsedJson = JSON.parse(event.data);
      const json = camelizeKeys(parsedJson, {
        process(key, convert, options) {
          return key === '_id' ? key : convert(key, options);
        },
      });

      if (json) {
        const { topicId } = json.comment;
        const payload = normalize(json.comment, postSchema);
        emit({
          payload,
          meta: {
            dataType: 'posts',
            topicId,
          },
        });
      }
    };

    const unsubscribe = () => socket.close();

    return unsubscribe;
  });
}

function* authWatcher() {
  try {
    const socket = yield call(createSocket);
    const channel = yield call(createSocketChannel, socket);

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
