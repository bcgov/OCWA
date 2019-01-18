import * as React from 'react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import EditorDateIcon from '@atlaskit/icon/glyph/editor/date';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import get from 'lodash/get';
import last from 'lodash/last';
import PersonIcon from '@atlaskit/icon/glyph/person';
import PresenceUnavailableIcon from '@atlaskit/icon/glyph/presence-unavailable';
import RequestIcon from '@src/modules/requests/components/request-icon';
import { RequestSchema } from '@src/modules/requests/types';

import * as styles from './styles.css';

function Card({ data }) {
  const totalCheckers = data.reviewers.length;
  const lastChronology = last(data.chronology);
  const now = new Date();
  const updatedAt = get(lastChronology, 'timestamp', now);
  const updatedAtString = distanceInWordsToNow(updatedAt);

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.cardIcon}>
          <RequestIcon value={data.state} />
        </div>
        {data.name}
      </div>
      <div className={styles.cardDetailsRow}>
        <small className={styles.author}>
          <PersonIcon size="small" />
          {data.author}
        </small>
        <small>
          <EditorFileIcon />
          {`${data.files.length} Files`}
        </small>
      </div>
      <div className={styles.cardDetailsRow}>
        <small>
          {totalCheckers > 0 ? <CheckboxIcon /> : <PresenceUnavailableIcon />}
          {totalCheckers > 0 ? `${totalCheckers} assigned` : 'Unclaimed'}
        </small>
        <small>
          <EditorDateIcon />
          {updatedAtString}
        </small>
      </div>
    </div>
  );
}

Card.propTypes = {
  data: RequestSchema.isRequired,
};

export default Card;
