import * as actions from '../actions';

const TYPE = 'test/get';
const REQUEST = {
  url: 'api/v1/requests',
};
let action = null;

describe('data/actions', () => {
  beforeEach(() => {
    action = actions.createDataAction(TYPE);
  });

  it('should create a request action with no other details', () => {
    expect(action(REQUEST)).toEqual({
      type: TYPE,
      meta: REQUEST,
    });
  });

  it('should include a payload (for post and put requests)', () => {
    const payload = {
      name: 'Lorem Ipsum',
    };

    expect(action(payload, REQUEST)).toEqual({
      type: TYPE,
      meta: REQUEST,
      payload,
    });
  });

  it('should accept a payload and meta', () => {
    const payload = {
      name: 'Lorem Ipsum',
    };
    const meta = {
      filter: 'new',
    };

    expect(action(payload, meta, REQUEST)).toEqual({
      type: TYPE,
      meta: {
        ...REQUEST,
        ...meta,
      },
      payload,
    });
  });

  it('should handle just a meta (no payload)', () => {
    const meta = {
      filter: 'new',
    };
    expect(action(null, meta, REQUEST)).toEqual({
      type: TYPE,
      meta: {
        ...REQUEST,
        ...meta,
      },
    });
  });

  it('should throw an error if no URL is passed', () => {
    expect(() => action()).toThrowError();
  });
});
