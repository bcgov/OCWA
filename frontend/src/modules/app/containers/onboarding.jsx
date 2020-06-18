import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import nth from 'lodash/nth';
import sanitize from 'sanitize-html';
import split from 'lodash/split';
import { Spotlight } from '@atlaskit/onboarding';
import useHelp from '@src/services/use-help';
import { useLocation } from 'react-router-dom';
import {
  exporterGroup,
  help,
  ocGroup,
  reportsGroup,
} from '@src/services/config';

function getGroupType(groups) {
  const hasExporterRole = includes(groups, exporterGroup);
  const hasOcRole = includes(groups, ocGroup);
  const hasReportsRole = includes(groups, reportsGroup);

  if (hasExporterRole) {
    return exporterGroup;
  } else if (hasOcRole) {
    return ocGroup;
  } else if (hasReportsRole) {
    return reportsGroup;
  }

  return '';
}

function Onboarding({ enabled, onComplete, user }) {
  const { pathname } = useLocation();
  const [index, setIndex] = useState(null);
  const { data, request } = useHelp(help.onboarding, getGroupType(user.groups));
  const pageContent = data.filter(d => {
    const [page] = split(d.page.title, '-');
    if (pathname === '/') {
      return page === 'home';
    }
    return pathname.includes(page);
  });
  const sections = pageContent.map(d => d.page && d.page.title);
  const section = nth(pageContent, index);
  const target = nth(sections, index);

  function handleComplete() {
    setIndex(null);
    onComplete();
  }

  useEffect(() => {
    if (user.groups && help.onboarding) {
      request();
    }
  }, [help.onboarding, user.groups, request]);

  useEffect(() => {
    if (enabled) {
      setIndex(0);
    }
  }, [enabled]);

  // There seems to be an ordering issue with the library, so trigger a browser resize
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [index]);

  const renderActions = () => {
    const actions = [];

    if (index > 0) {
      actions.push({ onClick: () => setIndex(s => s - 1), text: 'Prev' });
    }

    if (index + 1 < pageContent.length) {
      actions.push({ onClick: () => setIndex(s => s + 1), text: 'Next' });
    } else {
      actions.push({ onClick: handleComplete, text: 'Finish' });
    }

    return actions;
  };

  if (!isNil(index) && section) {
    return (
      <Spotlight
        actions={renderActions()}
        target={target}
        targetBgColor="#fff"
        testId="onboarding"
      >
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(section.page.body) }}
        />
      </Spotlight>
    );
  }

  return null;
}

Onboarding.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Onboarding;
