import { sanitizeURL, syncFilesPayload } from '../sagas';

describe('requests/sagas', () => {
  describe('utils', () => {
    it('should parse out the host and hash past the first + sign', () => {
      expect(
        sanitizeURL(
          'http://localhost:8000/files/cf30d725cfcfaf45723ec92448f7b458+e630147f2b9f0579'
        )
      ).toEqual('cf30d725cfcfaf45723ec92448f7b458');
    });

    it('should remove files queued to delete on autosave', () => {
      expect(syncFilesPayload(['1', '2'], ['2'])).toEqual(['1']);
      expect(syncFilesPayload(['1', '2', '3', '4'], ['2', '3'])).toEqual([
        '1',
        '4',
      ]);
    });
  });
});
