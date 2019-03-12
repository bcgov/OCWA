import * as React from 'react';
import PropTypes from 'prop-types';
import Files from '@src/modules/requests/containers/files';
import Title from '@src/components/title';

import { RequestSchema } from '@src/modules/requests/types';

function RequestFiles({ data, title }) {
  return (
    <div>
      <Title>{`${title} | Files (${data.files.length})`}</Title>
      <div id="request-files">
        <h4>Export Files</h4>
        <Files
          showDownloadButton
          ids={data.files}
          fileStatus={data.fileStatus}
        />
      </div>
      {data.supportingFiles.length > 0 && (
        <div id="request-supporting-files">
          <h4>Supporting Files</h4>
          <Files showDownloadButton ids={data.supportingFiles} />
        </div>
      )}
    </div>
  );
}

RequestFiles.propTypes = {
  data: RequestSchema.isRequired,
  title: PropTypes.string.isRequired,
};

export default RequestFiles;
