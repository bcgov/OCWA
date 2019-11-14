import { entities } from '../reducer';

describe('data module reducer', () => {
  describe('entities', () => {
    it('should load an updated file status', () => {
      const state = {
        requests: {
          r1: {
            _id: 'r1',
            files: ['f1'],
            fileStatus: {},
          },
        },
      };
      const fileStatus = {
        pass: 0,
        state: 0,
        message: '',
        name: 'Under 5Mb',
        mandatory: true,
      };

      expect(
        entities(state, {
          type: 'request/processed/success',
          payload: {
            entities: {
              requests: {
                r1: {
                  _id: 'r1',
                  fileStatus: {
                    f1: [fileStatus],
                  },
                },
              },
            },
            result: 'r1',
          },
        })
      ).toEqual({
        requests: {
          r1: {
            _id: 'r1',
            fileStatus: {
              f1: [fileStatus],
            },
            files: ['f1'],
          },
        },
      });
    });
  });
});
