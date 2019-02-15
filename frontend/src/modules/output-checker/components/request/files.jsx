import * as React from 'react';
import Files from '@src/modules/requests/containers/files';

import { RequestSchema } from '@src/modules/requests/types';

function RequestFiles({ data }) {
  return (
    <div>
      <div id="request-files">
        <h4>Export Files</h4>
        <Files ids={data.files} fileStatus={data.fileStatus} />
      </div>
      {data.supportingFiles.length > 0 && (
        <div id="request-supporting-files">
          <h4>Supporting Files</h4>
          <Files ids={data.supportingFiles} />
        </div>
      )}
    </div>
  );
}

RequestFiles.propTypes = {
  data: RequestSchema.isRequired,
};

export default RequestFiles;
