import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import ExportTypeIcon from '@src/components/export-type-icon';
import get from 'lodash/get';
import inRange from 'lodash/inRange';
import startCase from 'lodash/startCase';
import { withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
// Icons
import CopyIcon from '@atlaskit/icon/glyph/copy';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import TrashIcon from '@atlaskit/icon/glyph/trash';

import { duplicateRequest } from '../../utils';
import { RequestSchema } from '../../types';
import * as styles from './styles.css';

const omitProps = [
  '_id',
  'state',
  'reviewers',
  'author',
  'chronology',
  'fileStatus',
  'topic',
];

function RequestSidebar({
  data,
  isEditing,
  isSaving,
  history,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
  onWithdraw,
}) {
  /* eslint-disable no-alert, no-restricted-globals */
  // NOTE: Revomving for now, add back if needed
  // const submitHandler = () => {
  //   const c = confirm(
  //     'A reminder that you are responsible for ensuring Outputs are non-disclosive and uphold the secrecy provisions of the Statistics Act.'
  //   );
  //   if (c) {
  //     onSubmit(data._id);
  //   }
  // };
  const withdrawHandler = () => {
    const c = confirm(
      'Editing a submitted request automatically withdraws it. Do you still wish to proceed?'
    );

    if (c) {
      onWithdraw(data._id);
    }
  };
  const validate = () => {
    let isInvalid = isEditing || isSaving || data.state < 1;
    if (data.exportType === 'data') {
      isInvalid = data.files.length <= 0;
    } else if (data.exportType === 'code') {
      const invalidCode = 100;
      const failedCode = 400;
      const mergeRequestStatusCode = get(
        data,
        'mergeRequestStatus.code',
        invalidCode
      );
      isInvalid = !inRange(mergeRequestStatusCode, invalidCode, failedCode);
    }

    return isInvalid;
  };
  /* eslint-enable no-alerts, no-restricted-globals */

  return (
    <aside id="request-sidebar">
      <h6>Requester</h6>
      <div id="request-author">{data.author}</div>
      <h6>Export Type</h6>
      <div id="request-exportType">
        <ExportTypeIcon exportType={data.exportType} />
        <span id="request-exportTypeText" className={styles.exportTypeText}>
          {startCase(get(data, 'exportType', 'data'))}
        </span>
      </div>
      <h6>Output Checker</h6>
      <div id="request-reviewers">
        {data.reviewers.map(d => <p key={uid(d)}>{d}</p>)}
      </div>
      {data.reviewers.length <= 0 && (
        <p id="request-reviewers-empty">No reviewer has been assigned</p>
      )}
      <h6>Actions</h6>
      {data.state >= 2 &&
        data.state < 4 && (
          <React.Fragment>
            <div>
              <Button
                appearance="link"
                id="request-sidebar-withdraw-button"
                isDisabled={isSaving}
                iconBefore={<SignOutIcon />}
                onClick={withdrawHandler}
              >
                Edit Request
              </Button>
            </div>
            <div>
              <Button
                appearance="link"
                id="request-sidebar-cancel-button"
                iconBefore={<CrossIcon />}
                isDisabled={isSaving}
                onClick={() => onCancel(data._id)}
              >
                Cancel Request
              </Button>
            </div>
          </React.Fragment>
        )}
      {data.state < 2 && (
        <React.Fragment>
          <div>
            <Button
              appearance="link"
              id="request-sidebar-submit-button"
              isDisabled={validate()}
              iconBefore={<SignInIcon />}
              onClick={() => onSubmit(data._id)}
            >
              Submit Request
            </Button>
          </div>
          <div>
            <Button
              appearance="link"
              id="request-sidebar-edit-button"
              iconBefore={<EditFilledIcon />}
              isDisabled={isSaving}
              onClick={() => onEdit(data._id)}
            >
              {isEditing ? 'Done Editing' : 'Edit Request'}
            </Button>
          </div>
          <div>
            <Button
              appearance="link"
              id="request-sidebar-delete-button"
              iconBefore={<TrashIcon />}
              isDisabled={isEditing || isSaving}
              onClick={() => {
                history.push('/');
                onDelete(data._id);
              }}
            >
              Delete Request
            </Button>
          </div>
        </React.Fragment>
      )}
      {data.state >= 4 && (
        <Button
          appearance="link"
          id="request-sidebar-duplicate-button"
          iconBefore={<CopyIcon />}
          isDisabled={isSaving}
          onClick={() => history.push('/new', duplicateRequest(data))}
        >
          Duplicate Request
        </Button>
      )}
    </aside>
  );
}

RequestSidebar.propTypes = {
  data: RequestSchema.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
};

export default withRouter(RequestSidebar);
