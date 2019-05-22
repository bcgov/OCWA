import * as React from 'react';
import PropTypes from 'prop-types';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import Button from '@atlaskit/button';
import BitbucketCloneIcon from '@atlaskit/icon/glyph/bitbucket/clone';
import FileIcon from '@src/components/file-icon';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import { RequestSchema } from '@src/modules/requests/types';
import Spinner from '@atlaskit/spinner';

import * as styles from './styles.css';

const Downloads = ({
  data,
  fetchFiles,
  isLoading,
  onCloseDownloads,
  onOpenDownloads,
  request,
  selectedRequestId,
}) => {
  const actions = [{ text: 'Done', onClick: onCloseDownloads }];

  return (
    <React.Fragment>
      <Button
        iconBefore={<DocumentsIcon />}
        onClick={() => onOpenDownloads(request._id)}
      >
        {`View Downloads (${request.files.length})`}
      </Button>
      <ModalTransition>
        {selectedRequestId === request._id && (
          <ModalDialog
            actions={actions}
            heading={`Download Export Files (${data.length})`}
            onOpenComplete={() =>
              fetchFiles({ id: request._id, ids: request.files })
            }
          >
            {isLoading && (
              <div className={styles.loading}>
                <Spinner size="large" />
              </div>
            )}
            {!isLoading && (
              <div className={styles.files}>
                {data.map(d => (
                  <div key={d.id} className={styles.file}>
                    <div className={styles.fileName}>
                      <FileIcon type={d.fileType} />
                      {d.fileName}
                    </div>
                    <div>
                      <Button
                        href={`/api/v1/files/${d.id}?request_id=${request._id}`}
                        iconBefore={<BitbucketCloneIcon />}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalDialog>
        )}
      </ModalTransition>
    </React.Fragment>
  );
};

Downloads.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  fetchFiles: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onOpenDownloads: PropTypes.func.isRequired,
  onCloseDownloads: PropTypes.func.isRequired,
  request: RequestSchema.isRequired,
  selectedRequestId: PropTypes.string,
};

Downloads.defaultProps = {
  selectedRequestId: null,
};

export default Downloads;
