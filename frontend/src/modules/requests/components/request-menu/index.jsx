import * as React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import { RequestSchema } from '../../types';

function RequestMenu({
  data,
  menuText,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
  onWithdraw,
}) {
  return (
    <DropdownMenu trigger={menuText} triggerType="button">
      <DropdownItemGroup>
        {data.state >= 2 &&
          data.state < 4 && (
            <React.Fragment>
              <DropdownItem onClick={() => onWithdraw(data._id)}>
                Withdraw
              </DropdownItem>
              <DropdownItem onClick={() => onCancel(data._id)}>
                Cancel
              </DropdownItem>
            </React.Fragment>
          )}
        {data.state < 2 && (
          <React.Fragment>
            <DropdownItem onClick={() => onSubmit(data._id)}>
              Submit
            </DropdownItem>
            <DropdownItem onClick={() => onEdit(data._id)}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDelete(data._id)}>
              Delete
            </DropdownItem>
          </React.Fragment>
        )}
      </DropdownItemGroup>
    </DropdownMenu>
  );
}

RequestMenu.propTypes = {
  data: RequestSchema.isRequired,
  menuText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
};

RequestMenu.defaultProps = {
  menuText: 'Actions',
};

export default RequestMenu;
