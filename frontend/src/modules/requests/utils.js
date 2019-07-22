import { colors } from '@atlaskit/theme';
import flow from 'lodash/flow';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import { repositoryHost } from '@src/services/config';
import { _e, getZoneString } from '@src/utils';

// Form content
export const formText = {
  data: {
    title: 'Output Package and/or Output Groups Description',
    description:
      'Describe the context for this output package. If appropriate, you may choose to create Output Groups, which are a collection of output components that are batched for the purposes of description.',
  },
  code: {
    title: 'Output Code Description',
    description: 'Describe the code for this output.',
  },
};

// Request fields. Useful for forms/edit
export const requestFields = [
  {
    name: 'Contact Phone Number',
    value: 'phoneNumber',
    type: 'tel',
    isRequired: true,
    exportType: 'all',
    helperText:
      'Provide a phone number formatted xxx-xxx-xxxx to allow for quicker and more efficient contact if needed',
  },
  {
    name: 'Variable Descriptions',
    value: 'variableDescriptions',
    isRequired: true,
    type: 'textarea',
    exportType: 'data',
    helperText:
      'Provide the variable/field names of the original and self-constructed variables. For original variables please use the name from the metadata.',
  },
  {
    name: 'Sub-Population',
    value: 'subPopulation',
    isRequired: true,
    type: 'textarea',
    exportType: 'data',
    helperText:
      ' In the case of sub-samples and sub-populations, the selection criteria and size of the sub-samples',
  },
  {
    name: 'Relationship to previous or future (planned) outputs',
    value: 'selectionCriteria',
    type: 'textarea',
    exportType: 'data',
    helperText:
      'Describe any relationship to previous outputs. For example, a small adaptation of a previous output, pulled from the same or similar data, poses a risk of disclosure by differencing. This is especially for previously submitted tables within the same project, but could be, for example, other similar studies or projects based on the same sample of the population.',
  },
  {
    name: 'Explanation where outputs do not meet the rules of thumb',
    value: 'confidentiality',
    type: 'textarea',
    exportType: 'data',
    helperText:
      "Confidentiality disclosure to describe how it's upheld when criteria isn't met --> If you are submitting outputs which do not meet the rules of thumb, provide an explanation why the output entails no disclosure",
  },
  {
    name: 'General comments about the code',
    value: 'codeDescription',
    type: 'textarea',
    exportType: 'code',
    isRequired: true,
    helperText: _e(
      'Describe any details about the code you wish to {request} here'
    ),
  },
  {
    name: getZoneString({
      internal: 'Repository of code to export',
      external: 'Internal repository to send approved results',
    }),
    value: 'repository',
    type: 'repositoryHost',
    exportType: 'code',
    isRequired: true,
    helperText: 'Write out the full URL of the repository',
  },
  {
    name: _e('Branch of code to {request}'),
    value: 'branch',
    type: 'text',
    exportType: 'code',
    isRequired: true,
    helperText:
      'Write out the branch name in the repository the Output Checker should review',
  },
  {
    name: getZoneString({
      internal: 'Repository of code to import',
      external: 'External repository to send approved results',
    }),
    value: 'externalRepository',
    type: 'git',
    exportType: 'code',
    isRequired: true,
    helperText: 'Write out the full URL of the external repository',
  },
];

// Stored as a string here for native input[type="tel"] elements, so make into
// a RegExp if using anywhere else
export const phoneNumberRegex = '[0-9]{3}-?[0-9]{3}-?[0-9]{4}$';
export const gitUrlRegex =
  '((git|ssh|http(s)?)|(git@[w.]+))(:(//)?)([w.@:/-~]+)(.git)(/)?';
export const repositoryRegex = repositoryHost
  ? `${repositoryHost}([w.@:/-~]+)(.git)(/)?`
  : gitUrlRegex;

export const getRequestStateColor = (value = 0) => {
  if (!isNumber(value)) return colors.N200;

  switch (value) {
    case 0:
    case 1:
      return colors.N200;
    case 2:
      return colors.Y300;
    case 3:
      return colors.Y500;
    case 4:
      return colors.G500;
    case 5:
    case 6:
    default:
      return colors.R500;
  }
};

// Tidy up a request for duplication
export const duplicateRequest = data => {
  const formConfigKeys = requestFields
    .filter(d => {
      if (d.exportType === 'all') {
        return true;
      }

      return data.exportType === d.exportType;
    })
    .map(d => d.value);
  const keys = [
    ...formConfigKeys,
    'exportType',
    'name',
    'files',
    'supportingFiles',
  ];
  const cleaner = flow([
    d => pick(d, keys),
    d => mapValues(d, v => (isNil(v) ? '' : v)),
  ]);

  return cleaner({ ...data, name: `${data.name} Duplicate` });
};

export const getRequestStateText = (value = 0) => {
  let name = '';
  switch (value) {
    case 0:
      name = 'Draft';
      break;
    case 1:
      name = 'Work in Progress';
      break;
    case 2:
      name = 'Awaiting Review';
      break;
    case 3:
      name = 'In Review';
      break;
    case 4:
      name = 'Approved';
      break;
    case 5:
      name = 'Errors, needs revision';
      break;
    case 6:
      name = 'Cancelled';
      break;
    default:
      name = 'No state';
      break;
  }
  return name;
};

export default {
  duplicateRequest,
  formText,
  getRequestStateColor,
  getRequestStateText,
  requestFields,
  phoneNumberRegex,
  repositoryRegex,
  gitUrlRegex,
};
