import * as React from 'react';
import PropTypes from 'prop-types';
import Document16Icon from '@atlaskit/icon-file-type/glyph/document/16';
import Document24Icon from '@atlaskit/icon-file-type/glyph/document/24';
import SourceCode16Icon from '@atlaskit/icon-file-type/glyph/source-code/16';
import SourceCode24Icon from '@atlaskit/icon-file-type/glyph/source-code/24';

function ExportTypeIcon({ exportType, large }) {
  if (exportType === 'code') {
    return large ? <SourceCode24Icon /> : <SourceCode16Icon />;
  }

  return large ? <Document24Icon /> : <Document16Icon />;
}

ExportTypeIcon.propTypes = {
  exportType: PropTypes.string,
  large: PropTypes.bool,
};

ExportTypeIcon.defaultProps = {
  exportType: '',
  large: false,
};

export default ExportTypeIcon;
