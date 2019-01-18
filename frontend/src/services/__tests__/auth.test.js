import * as auth from '../auth';

const session = {
  expiresAt: '2018-11-26T22:01:58.000Z',
  refreshToken: 'refresh',
  token: 'token',
  user: {},
};

describe('services/auth', () => {
  it('should save a session payload', () => {
    expect(() => auth.saveSession(session)).not.toThrow();
    expect(() => auth.saveSession(null)).toThrow('No JWT payload');
  });

  it('should return the session', () => {
    auth.saveSession(session);
    expect(auth.getSession()).toEqual(session);
  });

  it('should destroy a session', () => {
    auth.saveSession(session);
    auth.destroySession();
    expect(() => auth.getSession()).toThrow('Session expired');
  });

  it('should return a token', () => {
    auth.saveSession(session);
    expect(auth.getToken()).toEqual('token');
  });

  it('should return a refresh token', () => {
    auth.saveSession(session);
    expect(auth.getRefreshToken()).toEqual('refresh');
  });
});
