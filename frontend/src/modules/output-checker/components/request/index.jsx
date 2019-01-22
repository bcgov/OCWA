import * as React from 'react';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import Discussion from '@src/modules/discussion/containers/discussion';
import DocumentsIcon from '@atlaskit/icon/glyph/documents';
import InfoIcon from '@atlaskit/icon/glyph/info';
import Tab from '@src/components/tabs/tab';
import Tabs from '@src/components/tabs';
import { Route, Switch } from 'react-router-dom';
import Spinner from '@atlaskit/spinner';

import Details from './details';
import Files from './files';
import RequestsNav from '../../containers/requests-nav';
import * as styles from './styles.css';

function Request({ data, match }) {
  return (
    <div className={styles.container}>
      <RequestsNav activeId={match.params.requestId} />
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
          <Switch>
            <Route
              exact
              path={match.url}
              render={() => <Details data={data} />}
            />
            <Route
              exact
              path={`${match.url}/files`}
              render={() => <Files data={data} />}
            />
            <Route
              exact
              path={`${match.url}/discussion`}
              render={() =>
                data.topic ? <Discussion id={data.topic} /> : <Spinner />
              }
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Request;
