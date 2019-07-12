import * as utils from '../';

describe('App utils', () => {
  describe('getZoneString', () => {
    const config = {
      internal: 'Internal String',
      external: 'External String',
    };

    describe('default functionality', () => {
      expect(utils.getZoneString()).toEqual('');
      expect(
        utils.getZoneString({
          wrong: 'key',
        })
      ).toEqual('');
    });

    describe('internal', () => {
      it('should work internally', () => {
        expect(utils.getZoneString(config)).toEqual(config.internal);
      });
    });

    describe('external', () => {
      beforeEach(() => {
        global.ZONE = 'external';
      });
      afterEach(() => {
        global.ZONE = 'internal';
      });
      it('should work externally', () => {
        expect(utils.getZoneString(config)).toEqual(config.external);
      });
    });
  });

  describe('_e', () => {
    describe('formatting', () => {
      it('retain first letter case', () => {
        expect(utils._e('This is an {Request}')).toEqual('This is an Export');
      });

      it('should work if incorrect template variable is used', () => {
        expect(utils._e('This is {wrong}')).toEqual('This is {wrong}');
      });

      it('should work if no template tag is present', () => {
        expect(utils._e('This is empty')).toEqual('This is empty');
      });
    });

    describe('internal strings', () => {
      it('should render a template', () => {
        expect(utils._e('This is an {request}')).toEqual('This is an export');
        expect(utils._e('This is an {download}')).toEqual('This is an import');
      });
    });

    describe('external strings', () => {
      beforeEach(() => {
        global.ZONE = 'external';
      });
      afterEach(() => {
        global.ZONE = 'internal';
      });

      it('should render a template', () => {
        expect(utils._e('This is an {request}')).toEqual('This is an import');
        expect(utils._e('This is an {download}')).toEqual('This is an export');
      });
    });
  });
});
