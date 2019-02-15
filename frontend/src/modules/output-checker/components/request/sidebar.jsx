import * as React from 'react';
import PropTypes from 'prop-types';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import FlagFilledIcon from '@atlaskit/icon/glyph/flag-filled';
import get from 'lodash/get';
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

  return (
    <aside className={styles.sidebar}>
      <h6>Exporter</h6>
      <p id="request-author-text">{data.author}</p>
      <h6>Reviewers</h6>
      {data.reviewers.length === 1 && (
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
      {user.username === assignedUser &&
        data.state < 4 && (
          <React.Fragment>
            <h6>Actions</h6>
            <Button
              appearance="link"
              id="request-sidebar-approve-button"
              iconBefore={<CheckCircleIcon primaryColor="green" />}
              isDisabled={isSaving}
              onClick={() => onApproveRequest(id)}
            >
              Approve Request
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
