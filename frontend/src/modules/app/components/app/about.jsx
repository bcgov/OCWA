import * as React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { commit, version } from '@src/services/config';
import { uid } from 'react-uid';

import * as styles from './styles.css';

const makeVersionString = (v, hash) => [v, hash].join(' - ');

function About({ data, fetchStatus, open, onToggle }) {
  return (
    <ModalTransition>
      {open && (
        <Modal
          actions={[{ text: 'Done', onClick: onToggle }]}
          heading="About this App"
        >
          {fetchStatus === 'loading' && (
            <div className={styles.aboutLoading}>
              <Spinner size="large" />
            </div>
          )}
          {fetchStatus === 'failed' && (
            <div className={styles.aboutErrorText}>
              <WarningIcon primaryColor="red" size="large" />
              <h5>Unable to load version data at this moment</h5>
            </div>
          )}
          {fetchStatus === 'loaded' && (
            <dl className={styles.aboutList}>
              <dt>User Interface Version</dt>
              <dd>{`${version} - ${commit}`}</dd>
              {data.map(d => (
                <React.Fragment key={uid(d)}>
                  <dt>{d.name}</dt>
                  <dd>{makeVersionString(d.v, d.hash)}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}
        </Modal>
      )}
    </ModalTransition>
  );
}

About.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      v: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
    })
  ).isRequired,
  fetchStatus: PropTypes.oneOf(['idle', 'loading', 'loaded', 'failed']),
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default About;
