import PropTypes from 'prop-types';

export const FileSchema = PropTypes.shape({
  fileName: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  state: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lastModified: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
});

export const FileStatusSchema = PropTypes.shape({
  pass: PropTypes.bool,
  state: PropTypes.number,
  message: PropTypes.string,
  name: PropTypes.string,
  mandatory: PropTypes.bool,
});

export default {
  FileSchema,
  FileStatusSchema,
};
