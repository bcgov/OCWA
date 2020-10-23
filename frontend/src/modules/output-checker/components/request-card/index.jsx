import * as React from 'react';
import PropTypes from 'prop-types';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import cx from 'classnames';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import EditorDateIcon from '@atlaskit/icon/glyph/editor/date';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import get from 'lodash/get';
import last from 'lodash/last';
import { Link } from 'react-router-dom';
import PersonIcon from '@atlaskit/icon/glyph/person';
import PresenceUnavailableIcon from '@atlaskit/icon/glyph/presence-unavailable';
import RequestIcon from '@src/modules/requests/components/request-icon';
import { RequestSchema } from '@src/modules/requests/types';
import SourceCode16Icon from '@atlaskit/icon-file-type/glyph/source-code/16';

import * as styles from './styles.css';

function RequestCard({ activeId, data, draggable }) {
  const totalCheckers = data.reviewers.length;
  const lastChronology = last(data.chronology);
  const now = new Date();
  const updatedAt = get(lastChronology, 'timestamp', now);
  const updatedAtString = distanceInWordsToNow(updatedAt);

  return (
    <div
      id={`request-list-card-${data._id}`}
      className={cx(styles.container, {
        [styles.draggable]: draggable,
        [styles.active]: data._id === activeId,
      })}
    >
      <div className={styles.title}>
        <div className={styles.icon}>
          <RequestIcon value={data.state} />
        </div>
        <Link className="request-list-card-link" to={`/requests/${data._id}`}>
          {data.name}
        </Link>
      </div>
      <div className={styles.detailsRow}>
        <small className={cx(styles.author, 'request-list-card-exporter-text')}>
          <PersonIcon size="small" />
          {data.author}
        </small>
        {data.exportType !== 'code' && (
          <small>
            <EditorFileIcon />
            <span className="request-list-card-files-text">
              {`${data.files.length} ${
                data.files.length > 1 ? 'Files' : 'File'
              }`}
            </span>
          </small>
        )}
        {data.exportType === 'code' && <SourceCode16Icon />}
      </div>
      <div className={styles.detailsRow}>
        <small className="request-list-card-assignee-text">
          {totalCheckers > 0 ? <CheckboxIcon /> : <PresenceUnavailableIcon />}
          {totalCheckers > 0 ? 'Assigned' : 'Unclaimed'}
        </small>
        <small className="request-list-card-date-text" >
          <EditorDateIcon />
          <time datatime={updatedAt}>{updatedAtString}</time>
        </small>
      </div>
    </div>
  );
}

RequestCard.propTypes = {
  activeId: PropTypes.string,
  data: RequestSchema.isRequired,
  draggable: PropTypes.bool,
};

RequestCard.defaultProps = {
  activeId: null,
  draggable: true,
};

export default RequestCard;
