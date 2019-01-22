import * as React from 'react';
import Files from '@src/modules/requests/containers/files';

function RequestFiles({ data }) {
  return (
    <div>
      <Files ids={data.files} fileStatus={data.fileStatus} />
    </div>
  );
}

export default RequestFiles;
