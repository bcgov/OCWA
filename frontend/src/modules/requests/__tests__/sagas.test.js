import { runSaga } from 'redux-saga';
import WS from 'jest-websocket-mock';
import { requestSocketHost } from '@src/services/config';
import { saveSession } from '@src/services/auth';

import { fileImportWatcher } from '../sagas';

const FILE = {
  fileId: 'b802d2',
  pass: false,
  state: 1,
  message: 'Warning',
  name: 'File size is under 3.5Mb',
  mandatory: false,
};

describe('Requests Saga', () => {
  describe('Request Socket', () => {
    let ws = null;

    beforeEach(() => {
      saveSession({
        token: '12312313123',
      });
      ws = new WS(requestSocketHost, { jsonProtocol: true });
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
      ws.send(FILE);
      expect(dispatched).toEqual([]);
    });

    it('should receive a file notification and send a processed action', () => {
      const { fileId, ...fileProps } = FILE;
      const data = {
        entities: {
          requests: {
            r1: {
              _id: 'r1',
              files: ['b802d2'],
              fileStatus: {},
            },
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
      ws.send(FILE);

      expect(dispatched).toEqual([
        {
          type: 'request/processed/success',
          payload: {
            entities: {
              requests: {
                r1: {
                  _id: 'r1',
                  fileStatus: {
                    b802d2: [fileProps],
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
