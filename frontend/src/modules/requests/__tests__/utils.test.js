import { colors } from '@atlaskit/theme';

import * as utils from '../utils';

describe('request/utils', () => {
  describe('phone number validation', () => {
    const regex = new RegExp(utils.phoneNumberRegex);
    it('should pass an xxx-xxx-xxxx phone number', () => {
      expect(regex.test('555-555-5555')).toBeTruthy();
    });
    it('should pass a number only phone number', () => {
      expect(regex.test('5555555555')).toBeTruthy();
    });
    it('should fail invalid phone numbers', () => {
      expect(regex.test('abc-def-ghij')).toBeFalsy();
    });
  });

  describe('url validation', () => {
    it('should validate a git URL', () => {
      const regex = new RegExp(utils.gitUrlRegex);
      expect(regex.test('https://github.com/org/repo.git')).toBeTruthy();
      expect(regex.test('asdfasdf')).toBeFalsy();
    });

    it('should validate a configurable repository URL', () => {
      const regex = new RegExp(utils.repositoryRegex);
      expect(
        regex.test('https://example.com/shares/test/repo.git')
      ).toBeTruthy();
      expect(
        regex.test('https://my-internal-website.com/test.git')
      ).toBeFalsy();
    });
  });

  describe('request colors', () => {
    it('should default to N200 if it is not a state number value', () => {
      expect(utils.getRequestStateColor()).toEqual(colors.N200);
      expect(utils.getRequestStateColor(null)).toEqual(colors.N200);
      expect(utils.getRequestStateColor(undefined)).toEqual(colors.N200);
      expect(utils.getRequestStateColor('test')).toEqual(colors.N200);
    });

    it('should pass number states', () => {
      expect(utils.getRequestStateColor(0)).toEqual(colors.N200);
      expect(utils.getRequestStateColor(1)).toEqual(colors.N200);
      expect(utils.getRequestStateColor(2)).toEqual(colors.Y300);
      expect(utils.getRequestStateColor(3)).toEqual(colors.Y500);
      expect(utils.getRequestStateColor(4)).toEqual(colors.G500);
      expect(utils.getRequestStateColor(5)).toEqual(colors.R500);
      expect(utils.getRequestStateColor(6)).toEqual(colors.R500);
    });
  });

  describe('request duplication', () => {
    it('should duplicate a data request payload', () => {
      const original = {
        _id: 1,
        name: 'Duplicate Me',
        phoneNumber: '5555555555',
        exportType: 'data',
        variableDescriptions: 'Description',
        files: ['file1', 'file2'],
        supportingFiles: ['sFile1', 'sFile2'],
      };
      expect(utils.duplicateRequest(original)).toEqual({
        data: {
          name: 'Duplicate Me Duplicate',
          phoneNumber: '5555555555',
          exportType: 'data',
          variableDescriptions: 'Description',
          files: ['file1', 'file2'],
          supportingFiles: ['sFile1', 'sFile2'],
        },
      });
    });

    it('should duplicate a code request payload', () => {
      const original = {
        _id: 1,
        name: 'Duplicate Me',
        phoneNumber: '5555555555',
        exportType: 'code',
        repository: 'http://test.com',
        branch: 'develop',
        externalRepository: 'http://test.com',
        codeDescription: 'Code Description',
      };
      expect(utils.duplicateRequest(original)).toEqual({
        data: {
          name: 'Duplicate Me Duplicate',
          phoneNumber: '5555555555',
          exportType: 'code',
          repository: 'http://test.com',
          branch: 'develop',
          externalRepository: 'http://test.com',
          codeDescription: 'Code Description',
        },
      });
    });

    it('should drop weird or nil values', () => {
      const original = {
        _id: 1,
        name: 'Duplicate Me',
        phoneNumber: null,
        exportType: 'code',
        repository: 'http://test.com',
        branch: 'develop',
        externalRepository: 'http://test.com',
        codeDescription: 'Code Description',
        outdatedField: 'asdfasdf',
      };
      expect(utils.duplicateRequest(original)).toEqual({
        data: {
          name: 'Duplicate Me Duplicate',
          phoneNumber: '',
          exportType: 'code',
          repository: 'http://test.com',
          branch: 'develop',
          externalRepository: 'http://test.com',
          codeDescription: 'Code Description',
        },
      });
    });
  });
});
