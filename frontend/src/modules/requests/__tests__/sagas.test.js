import { sanitizeURL } from '../sagas';

describe('requests/sagas', () => {
  describe('utils', () => {
    it('should parse out the host and hash past the first + sign', () => {
      expect(
        sanitizeURL(
          'http://localhost:8000/files/cf30d725cfcfaf45723ec92448f7b458+e630147f2b9f0579'
        )
      ).toEqual('cf30d725cfcfaf45723ec92448f7b458');
    });
  });
});
