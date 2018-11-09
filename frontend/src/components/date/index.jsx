import * as React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

function DateComponent(props) {
  return (
    <time dateTime={format(props.value, 'YYYY-MM-DD')}>
      {format(props.value, props.format)}
    </time>
  );
}

DateComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  format: PropTypes.string,
};

DateComponent.defaultProps = {
  format: 'MM-DD-YY',
};

export default DateComponent;
