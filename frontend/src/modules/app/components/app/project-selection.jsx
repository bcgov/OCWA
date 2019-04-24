import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import { uid } from 'react-uid';
import { ocGroup } from '@src/services/config';

import * as styles from './styles.css';

function getProjectName(name) {
  if (name === ocGroup) {
    return 'Output Checker';
  }

  return name.substr(1);
}

function ProjectSelection({ data, onSelect }) {
  return (
    <div className={styles.projectSelection}>
      <div id="app-project-selection" className={styles.projects}>
        <h3>Which project are you working on?</h3>
        {data.map((d, index) => (
          <div key={uid(d, index)} className={styles.project}>
            <Button
              shouldFitContainer
              className="app-project-button"
              id={`${d.substr(1)}-button`}
              onClick={() => onSelect(d)}
            >
              {getProjectName(d)}
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
