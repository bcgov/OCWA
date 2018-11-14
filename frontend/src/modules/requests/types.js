import PropTypes from 'prop-types';

export const RequestSchema = PropTypes.shape({
  name: PropTypes.string,
  author: PropTypes.string,
  chronology: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string,
      enteredState: PropTypes.number,
      change_by: PropTypes.string,
    })
  ),
  files: PropTypes.array,
  reviewers: PropTypes.array,
  state: PropTypes.number,
  supportingFiles: PropTypes.array,
  tags: PropTypes.array,
  topic: PropTypes.string,
  __v: PropTypes.number,
  _id: PropTypes.string,
});

export const FileSchema = PropTypes.shape({
  filename: PropTypes.string.isRequired,
  filetype: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  state: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
});

export default {
  RequestSchema,
  FileSchema,
};
