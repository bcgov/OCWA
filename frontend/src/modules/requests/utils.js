import { colors } from '@atlaskit/theme';

// Request fields. Useful for forms/edit
export const requestFields = [
  {
    name: 'Contact Phone Number',
    value: 'phoneNumber',
    type: 'tel',
    isRequired: true,
    helperText:
      'Provide a phone number formatted xxx-xxx-xxxx to allow for quicker and more efficient contact if needed',
  },
  {
    name: 'Variable Descriptions',
    value: 'variableDescriptions',
    isRequired: true,
    type: 'textarea',
    helperText:
      'Provide a description of original and self-constructed variables (include full labeling of all variables and value labels)',
  },
  {
    name: 'Sub-Population',
    value: 'subPopulation',
    isRequired: true,
    type: 'textarea',
    helperText:
      ' In the case of sub-samples and sub-populations, the selection criteria and size of the sub-samples',
  },
  {
    name: 'Relationship to previous or future (planned) outputs',
    value: 'selectionCriteria',
    type: 'textarea',
    helperText:
      'Describe any relationship to previous outputs. For example, a small adaptation of a previous output, pulled from the same or similar data, poses a risk of disclosure by differencing. This is especially for previously submitted tables within the same project, but could be, for example, other similar studies or projects based on the same sample of the population.',
  },
  {
    name: 'Explanation where outputs do not meet the rules of thumb',
    value: 'confidentiality',
    type: 'textarea',
    helperText:
      "Confidentiality disclosure to describe how it's upheld when criteria isn't met --> If you are submitting outputs which do not meet the rules of thumb, provide an explanation why the output entails no disclosure",
  },
];

// Stored as a string here for native input[type="tel"] elements, so make into
// a RegExp if using anywhere else
export const phoneNumberRegex = '[0-9]{3}-[0-9]{3}-[0-9]{4}$';

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
  getRequestStateColor,
  requestFields,
  phoneNumberRegex,
};
