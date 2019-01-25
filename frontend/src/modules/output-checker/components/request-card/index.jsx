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

import * as styles from './styles.css';

function RequestCard({ activeId, data, draggable }) {
  const totalCheckers = data.reviewers.length;
  const lastChronology = last(data.chronology);
  const now = new Date();
  const updatedAt = get(lastChronology, 'timestamp', now);
  const updatedAtString = distanceInWordsToNow(updatedAt);

  return (
    <div
      className={cx(styles.container, {
        [styles.draggable]: draggable,
        [styles.active]: data._id === activeId,
      })}
    >
      <div className={styles.title}>
        <div className={styles.icon}>
          <RequestIcon value={data.state} />
        </div>
        <Link to={`/requests/${data._id}`}>{data.name}</Link>
      </div>
      <div className={styles.detailsRow}>
        <small className={styles.author}>
          <PersonIcon size="small" />
          {data.author}
        </small>
        <small>
          <EditorFileIcon />
          {`${data.files.length} ${data.files.length > 1 ? 'Files' : 'File'}`}
        </small>
      </div>
      <div className={styles.detailsRow}>
        <small>
          {totalCheckers > 0 ? <CheckboxIcon /> : <PresenceUnavailableIcon />}
          {totalCheckers > 0 ? 'Assigned' : 'Unclaimed'}
        </small>
        <small>
          <EditorDateIcon />
          {updatedAtString}
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
