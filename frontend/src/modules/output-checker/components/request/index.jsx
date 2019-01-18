import * as React from 'react';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import InfoIcon from '@atlaskit/icon/glyph/info';
import Tab from '@src/components/tabs/tab';
import Tabs from '@src/components/tabs';

import RequestsNav from '../../containers/requests-nav';
import * as styles from './styles.css';

function Request({ data, match }) {
  return (
    <div className={styles.container}>
      <RequestsNav />
      <div className={styles.request}>
        <header className={styles.header}>
          <h2>{data.name}</h2>
          <Tabs>
            <Tab icon={<InfoIcon />} text="Details" url={match.url} />
            <Tab
              icon={<DocumentsIcon />}
              text="Files"
              url={`${match.url}/files`}
            />
            <Tab
              icon={<CommentIcon />}
              text="Discussion"
              url={`${match.url}/discussion`}
            />
          </Tabs>
        </header>
        <div className={styles.main}>
          <div>
            <h6>Description</h6>
            <p>{data.description || 'No Description provided'}</p>
            <h6>Confidentiality</h6>
            <p>{data.confidentiality || 'No Confidentiality provided'}</p>
            <h6>Frequency</h6>
            <p>{data.freq || 'No Frequency provided'}</p>
            <h6>Purpose</h6>
            <p>{data.purpose || 'No Purpose provided'}</p>
            <h6>Selection Criteria</h6>
            <p>{data.selectionCriteria || 'No Selection Criteria provided'}</p>
            <h6>Variable Description</h6>
            <p>
              {data.variableDescription || 'No Variable Description provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Request;
