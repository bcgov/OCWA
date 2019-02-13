import * as React from 'react';
import PropTypes from 'prop-types';
// Icons
import Archive24Icon from '@atlaskit/icon-file-type/glyph/archive/24';
import Image24Icon from '@atlaskit/icon-file-type/glyph/image/24';
import Generic24Icon from '@atlaskit/icon-file-type/glyph/generic/24';
import Gif24Icon from '@atlaskit/icon-file-type/glyph/gif/24';
import PdfDocument24Icon from '@atlaskit/icon-file-type/glyph/pdf-document/24';
import Presentation24Icon from '@atlaskit/icon-file-type/glyph/presentation/24';
import SourceCode24Icon from '@atlaskit/icon-file-type/glyph/source-code/24';
import Spreadsheet24Icon from '@atlaskit/icon-file-type/glyph/spreadsheet/24';
import WordDocument24Icon from '@atlaskit/icon-file-type/glyph/word-document/24';

function FileIcon({ type }) {
  let Icon = null;
  switch (type) {
    case 'application/zip':
    case 'application/x-rar-compressed':
    case 'application/x-tar':
      Icon = Archive24Icon;
      break;

    case 'image/png':
    case 'image/jpeg':
    case 'image/svg+xml':
    case 'image/tiff':
      Icon = Image24Icon;
      break;

    case 'application/gif':
      Icon = Gif24Icon;
      break;

    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      Icon = Presentation24Icon;
      break;

    case 'application/json':
    case 'application/javascript':
    case 'text/html':
    case 'text/css':
      Icon = SourceCode24Icon;
      break;

    case 'application/pdf':
      Icon = PdfDocument24Icon;
      break;

    case 'text/csv':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.oasis.opendocument.spreadsheet':
      Icon = Spreadsheet24Icon;
      break;

    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.oasis.opendocument.text':
      Icon = WordDocument24Icon;
      break;

    case 'text/plain':
    default:
      Icon = Generic24Icon;
      break;
  }

  return <Icon />;
}

FileIcon.propTypes = {
  type: PropTypes.string,
};

FileIcon.defaultProps = {
  type: null,
};

export default FileIcon;
