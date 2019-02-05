import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@atlaskit/avatar';
import Dropdown, { DropdownItem } from '@atlaskit/dropdown-menu';
import aboutButton from '@src/modules/app/containers/about-button';

const AboutDropdownItem = props => (
  <DropdownItem {...props}>About this App</DropdownItem>
);
const AboutButton = aboutButton(AboutDropdownItem);

function AppBarMenu({ children, user }) {
  return (
    <Dropdown
      position="bottom right"
      trigger={<Avatar borderColor="#0052CC" name={user.displayName} />}
    >
      <DropdownItem>{`Howdy, ${user.displayName}`}</DropdownItem>
      {children}
      <AboutButton />
      <DropdownItem href="/auth/logout">Logout</DropdownItem>
    </Dropdown>
  );
}

AppBarMenu.propTypes = {
  children: PropTypes.arrayOf(PropTypes.instanceOf(DropdownItem)),
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

AppBarMenu.defaultProps = {
  children: null,
};

export default AppBarMenu;
