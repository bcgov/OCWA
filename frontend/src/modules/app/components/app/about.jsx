import * as React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { commit, version } from '@src/services/config';

import * as styles from './styles.css';

function About({ data, open, onToggle }) {
  return (
    <ModalTransition>
      {open && (
        <Modal
          actions={[{ text: 'Done', onClick: onToggle }]}
          heading="About this App"
        >
          <dl className={styles.aboutList}>
            <dt>User Interface Version</dt>
            <dd>{`${version} - ${commit}`}</dd>
            {data.map(d => (
              <React.Fragment key={d}>
                <dt>AppName</dt>
                <dd>{d}</dd>
              </React.Fragment>
            ))}
          </dl>
        </Modal>
      )}
    </ModalTransition>
  );
}

About.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default About;
