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
  exportType: PropTypes.oneOf(['code', 'data']),
  mergeRequestLink: PropTypes.string,
  type: PropTypes.oneOf(['import', 'export']),
  files: PropTypes.array,
  reviewers: PropTypes.array,
  state: PropTypes.number,
  supportingFiles: PropTypes.array,
  tags: PropTypes.array,
  topic: PropTypes.string,
  __v: PropTypes.number,
  _id: PropTypes.string,
});

export default {
  RequestSchema,
};
