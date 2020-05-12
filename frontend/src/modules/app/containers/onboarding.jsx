import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import nth from 'lodash/nth';
import sanitize from 'sanitize-html';
import split from 'lodash/split';
import { Spotlight } from '@atlaskit/onboarding';
import useHelp from '@src/services/use-help';
import { useLocation } from 'react-router-dom';

function Onboarding({ enabled, onComplete }) {
  const { pathname } = useLocation();
  const [index, setIndex] = useState(null);
  const { data, request } = useHelp('onboarding');
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
    request();
  }, [request]);

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

    if (index + 1 < data.length) {
      actions.push({ onClick: () => setIndex(s => s + 1), text: 'Next' });
    } else {
      actions.push({ onClick: handleComplete, text: 'Finish' });
    }

    if (index > 0) {
      actions.push({ onClick: () => setIndex(s => s - 1), text: 'Prev' });
    }

    return actions;
  };

  if (!isNil(index) && section) {
    console.log(target, section);
    return (
      <Spotlight actions={renderActions()} target={target} testId="onboarding">
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
};

export default Onboarding;
