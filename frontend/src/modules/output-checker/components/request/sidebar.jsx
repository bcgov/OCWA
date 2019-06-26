import * as React from 'react';
import PropTypes from 'prop-types';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ExportTypeIcon from '@src/components/export-type-icon';
import FlagFilledIcon from '@atlaskit/icon/glyph/flag-filled';
import get from 'lodash/get';
import startCase from 'lodash/startCase';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { RequestSchema } from '@src/modules/requests/types';

import * as styles from './styles.css';

function Sidebar({
  data,
  id,
  isSaving,
  onApproveRequest,
  onDenyRequest,
  onPickupRequest,
  onRequestRevisions,
  user,
}) {
  const assignedUser = get(data, 'reviewers[0]', '-');
  const isCodeExport = data.exportType === 'code';
  const isPreparing = isCodeExport && !data.mergeRequestLink;
  const isApproveButtonDisabled = isPreparing ? true : isSaving;
  const approveButtonText = isPreparing
    ? 'Preparing Merge Request'
    : 'Approve Request';

  return (
    <aside className={styles.sidebar}>
      <h6>Requester</h6>
      <p id="request-author-text">{data.author}</p>
      <h6>Export Type</h6>
      <div id="request-exportType">
        <ExportTypeIcon exportType={data.exportType} />
        <span id="request-exportTypeText" className={styles.exportTypeText}>
          {startCase(get(data, 'exportType', 'data'))}
        </span>
      </div>
      <h6>Reviewers</h6>
      {data.reviewers.length > 0 && (
        <p id="request-assigned-oc">{assignedUser}</p>
      )}
      {data.reviewers.length <= 0 &&
        data.state < 3 && (
          <Button
            appearance="link"
            id="request-sidebar-pickup-button"
            iconBefore={<AddCircleIcon primaryColor="green" />}
            isDisabled={isSaving}
            onClick={() => onPickupRequest(id)}
          >
            Assign to Me
          </Button>
        )}
      {data.reviewers.includes(user.id) &&
        data.state === 3 && (
          <React.Fragment>
            <h6>Actions</h6>
            <Button
              appearance="link"
              id="request-sidebar-approve-button"
              iconBefore={<CheckCircleIcon primaryColor="green" />}
              isDisabled={isApproveButtonDisabled}
              href={isCodeExport && data.mergeRequestLink}
              onClick={() => !isCodeExport && onApproveRequest(id)}
            >
              {approveButtonText}
            </Button>
            <Button
              appearance="link"
              id="request-sidebar-approve-button"
              iconBefore={<SelectClearIcon primaryColor="red" />}
              isDisabled={isSaving}
              onClick={() => onDenyRequest(id)}
            >
              Deny Request
            </Button>
            <Button
              appearance="link"
              id="request-sidebar-request-revisions-button"
              iconBefore={<FlagFilledIcon primaryColor="orange" />}
              isDisabled={isSaving}
              onClick={() => onRequestRevisions(id)}
            >
              Request Revisions
            </Button>
          </React.Fragment>
        )}
    </aside>
  );
}

Sidebar.propTypes = {
  data: RequestSchema.isRequired,
  id: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onApproveRequest: PropTypes.func.isRequired,
  onDenyRequest: PropTypes.func.isRequired,
  onRequestRevisions: PropTypes.func.isRequired,
  onPickupRequest: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Sidebar;
