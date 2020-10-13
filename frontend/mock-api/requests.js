const subDays = require('date-fns/sub_days');
const random = require('lodash/random');
const sample = require('lodash/sample');

const dataexport = require('./dataexport');
const today = new Date();

module.exports = () => {
  const requests = [];
  const defaults = {
    forms: {
      internal: [
        { value: 'data', form: 'dataexport' },
        { value: 'code', form: 'codeexport' },
      ],
      external: [
        { value: 'data', form: 'dataimport' },
        { value: 'code', form: 'codeimport' },
      ],
    },
  };

  for (let i = 0; i < 1000; i++) {
    requests.push({
      _id: i,
      state: random(0, 6),
      tags: [],
      supportingFiles: [],
      reviewers: [sample(['josh-oc', 'paul'])],
      files: ['63836f3343fc4817b47ec5c6c7d5227c'],
      chronology: [
        {
          timestamp: '2019-04-15T17:55:45.355Z',
          enteredState: 0,
          change_by: 'pripley@idir',
        },
        {
          timestamp: '2019-04-15T17:55:59.342Z',
          enteredState: 1,
          change_by: 'pripley@idir',
          changes: { files: [] },
        },
        {
          timestamp: '2019-04-15T17:56:11.367Z',
          enteredState: 2,
          change_by: 'pripley@idir',
        },
        {
          timestamp: '2019-07-10T16:46:27.792Z',
          enteredState: 3,
          change_by: 'hodor',
        },
        {
          timestamp: subDays(today, i),
          enteredState: 1,
          change_by: 'hodor',
        },
      ],
      name: 'test22',
      purpose: '',
      variableDescriptions: '',
      selectionCriteria: '',
      steps: '',
      freq: '',
      confidentiality: '',
      author: 'pripley@idir',
      topic: '5cb4c5a1a5762c0035f02a31',
      type: 'export',
      formName: 'dataexport',
      submittedDate: subDays(today, i),
      projects: ['project_1'],
      data: {
        _id: '5cb4c5a1559ad10013ead3ae',
        tags: [],
        purpose: '',
        variableDescriptions: '',
        selectionCriteria: '',
        steps: '',
        freq: '',
        confidentiality: '',
        submittedDate: '2019-04-15T17:56:11.367Z',
        projects: ['project_1'],
      },
    });
  }

  return { defaults, requests };
};
