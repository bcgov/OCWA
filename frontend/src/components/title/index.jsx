import * as React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

function Title({ children }) {
  return (
    <Helmet
      defaultTitle="OCWA"
      titleTemplate="OCWA | Output Checker Workflow App | %s"
    >
      <title>{children}</title>
    </Helmet>
  );
}

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
