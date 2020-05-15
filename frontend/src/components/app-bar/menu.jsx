import * as React from 'react';
import PropTypes from 'prop-types';
import at from 'lodash/at';
import Avatar from '@atlaskit/avatar';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import isEmpty from 'lodash/isEmpty';
import aboutButton from '@src/modules/app/containers/about-button';
import reportErrorButton from '@src/modules/app/containers/report-error-button';

const AboutDropdownItem = props => (
  <DropdownItem {...props}>About this App</DropdownItem>
);
const ReportErrorDropdownItem = props => (
  <DropdownItem {...props}>Report an Error</DropdownItem>
);
const AboutButton = aboutButton(AboutDropdownItem);
const ReportErrorButton = reportErrorButton(ReportErrorDropdownItem);

function AppBarMenu({ children, onOpenHelp, onToggleOnboarding, user }) {
  const possibleDisplayNameValues = at(user, [
    'displayName',
    'username',
    'email',
  ]);
  const displayName = possibleDisplayNameValues.find(d => !isEmpty(d));

  return (
    <Dropdown
      position="bottom right"
      trigger={<Avatar borderColor="#0052CC" name={displayName || ''} />}
    >
      {displayName && (
        <DropdownItem>
          Signed in as <strong>{displayName}</strong>
        </DropdownItem>
      )}
      <DropdownItem onClick={onToggleOnboarding}>Show Page Tips</DropdownItem>
      <DropdownItem onClick={onOpenHelp}>View Help Documentation</DropdownItem>
      {children}
      <ReportErrorButton />
      <AboutButton />
      <DropdownItem href="/auth/logout">Logout</DropdownItem>
    </Dropdown>
  );
}

AppBarMenu.propTypes = {
  children: PropTypes.arrayOf(PropTypes.instanceOf(DropdownItem)),
  onOpenHelp: PropTypes.func.isRequired,
  onToggleOnboarding: PropTypes.func.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

AppBarMenu.defaultProps = {
  children: null,
};

export default AppBarMenu;
