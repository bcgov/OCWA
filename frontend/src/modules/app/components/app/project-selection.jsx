import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import { uid } from 'react-uid';

import * as styles from './styles.css';

function ProjectSelection({ data, onSelect }) {
  return (
    <div className={styles.projectSelection}>
      <div className={styles.projects}>
        <h3>Select a Project</h3>
        {data.map((d, index) => (
          <div key={uid(d, index)} className={styles.project}>
            <Button shouldFitContainer onClick={() => onSelect(d)}>
              {d}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

ProjectSelection.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProjectSelection;
