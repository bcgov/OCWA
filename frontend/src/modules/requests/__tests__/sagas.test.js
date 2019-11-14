import { runSaga } from 'redux-saga';
import WS from 'jest-websocket-mock';
import { requestSocketHost } from '@src/services/config';
import { saveSession } from '@src/services/auth';

import { fileImportWatcher } from '../sagas';

const FILE = {
  fileId: 'f1',
  pass: 0,
  state: 0,
  message: '',
  name: 'Under 5Mb',
  mandatory: true,
};

describe('Requests Saga', () => {
  describe('Request Socket', () => {
    let ws = null;

    beforeEach(() => {
      saveSession({
        token: '12312313123',
      });
      ws = new WS(requestSocketHost);
    });

    afterEach(() => {
      WS.clean();
    });

    it('should ignore notifications for requests not stored locally', () => {
      const dispatched = [];
      runSaga(
        {
          dispatch: action => dispatched.push(action),
          getState: () => ({}),
        },
        fileImportWatcher
      );
      ws.send(JSON.stringify(FILE));
      expect(dispatched).toEqual([]);
    });

    it('should receive a file notification and send a processed action', () => {
      const { fileId, ...fileProps } = FILE;
      const data = {
        requests: {
          r1: {
            _id: 'r1',
            files: ['f1'],
            fileStatus: {},
          },
        },
      };

      const dispatched = [];
      runSaga(
        {
          dispatch: action => dispatched.push(action),
          getState: () => ({
            data,
          }),
        },
        fileImportWatcher
      );
      ws.send(JSON.stringify(FILE));
      expect(dispatched).toEqual([
        {
          type: 'request/processed/success',
          payload: {
            entities: {
              requests: {
                r1: {
                  _id: 'r1',
                  fileStatus: {
                    f1: [fileProps],
                  },
                },
              },
            },
            result: 'r1',
          },
        },
      ]);
    });
  });
});
