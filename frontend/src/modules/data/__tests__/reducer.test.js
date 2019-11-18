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

    it("should add additional notificaton to the file's status array", () => {
      const fileStatus1 = {
        pass: false,
        state: 1,
        message: 'Warning',
        name: 'File size is under 3.5Mb',
        mandatory: false,
      };
      const fileStatus2 = {
        pass: true,
        state: 1,
        message: '',
        name: 'Under 5Mb',
        mandatory: true,
      };
      const state = {
        requests: {
          r1: {
            _id: 'r1',
            files: ['f1'],
            fileStatus: {
              f1: [fileStatus1],
            },
          },
        },
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
                    f1: [fileStatus2],
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
              f1: [fileStatus1, fileStatus2],
            },
            files: ['f1'],
          },
        },
      });
    });
  });
});
