import { colors } from '@atlaskit/theme';

// Request fields. Useful for forms/edit
export const requestFields = [
  {
    name: 'Purpose',
    value: 'purpose',
    helperText: 'The purpose of the request',
  },
  {
    name: 'Variable Descriptions',
    value: 'variableDescriptions',
    helperText: 'Description of variables in the request',
  },
  {
    name: 'Selection Criteria',
    value: 'selectionCriteria',
    helperText:
      'Selection criteria and sample size description for the request',
  },
  {
    name: 'Steps',
    value: 'steps',
    helperText: 'Annotation of steps taken',
  },
  {
    name: 'Frequency',
    value: 'freq',
    helperText: 'Weighted results and unweighted frequencies',
  },
  {
    name: 'Confidentiality',
    value: 'confidentiality',
    helperText:
      "Confidentiality disclosure to describe how it's upheld when criteria isn't met --> If you are submitting outputs which do not meet the rules of thumb, provide an explanation why the output entails no disclosure",
  },
];

export const getRequestStateColor = (value = 0) => {
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
      return colors.R500;
    default:
      return null;
  }
};

export default {
  requestFields,
  getRequestStateColor,
};
