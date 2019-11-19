import { entities } from '../reducer';

const fileStatus1 = {
  pass: false,
  state: 0,
  message: 'Warning',
  name: 'File size is under 3.5Mb',
  mandatory: false,
};
const fileStatus2 = {
  pass: true,
  state: 0,
  message: '',
  name: 'Under 5Mb',
  mandatory: true,
};

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

      expect(
        entities(state, {
          type: 'request/processed/success',
          payload: {
            entities: {
              requests: {
                r1: {
                  _id: 'r1',
                  fileStatus: {
                    f1: [fileStatus1],
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
              f1: [fileStatus1],
            },
            files: ['f1'],
          },
        },
      });
    });

    it("should add additional notificaton to the file's status array", () => {
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
              f1: [fileStatus2, fileStatus1],
            },
            files: ['f1'],
          },
        },
      });
    });

    it('should update an existing file status', () => {
      const state = {
        requests: {
          r1: {
            _id: 'r1',
            files: ['f1'],
            fileStatus: {
              f1: [fileStatus1, fileStatus2],
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
                    f1: [
                      {
                        ...fileStatus1,
                        state: 1, // The state is most likely to be the prop to update
                      },
                      fileStatus2,
                    ],
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
              f1: [{ ...fileStatus1, state: 1 }, fileStatus2],
            },
            files: ['f1'],
          },
        },
      });
    });
  });
});
