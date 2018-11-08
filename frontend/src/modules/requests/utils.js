import { colors } from '@atlaskit/theme';

export const getRequestStateColor = (value = 0) => {
  switch (value) {
    case 0:
    case 1:
      return colors.N200;
    case 2:
      return colors.B300;
    case 3:
      return colors.B500;
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
};
