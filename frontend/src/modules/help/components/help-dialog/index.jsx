import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '@atlaskit/theme';
import Lozenge from '@atlaskit/lozenge';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import sanitize from 'sanitize-html';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import useHelp from '@src/services/use-help';
import { help } from '@src/services/config';

import {
  Article,
  ErrorContainer,
  HelpContent,
  HelpLoading,
  Section,
} from './styles';

function HelpDialog({ onClose, open, type }) {
  const { data, request, status } = useHelp(help.main, type);

  return (
    <ModalTransition>
      {open && (
        <ModalDialog
          actions={[{ onClick: onClose, text: 'Done' }]}
          onOpenComplete={request}
          heading={status !== 'error' && 'BBSAE Help'}
          width="large"
          testId="help-dialog"
        >
          {status === 'error' && (
            <ErrorContainer data-testid="error-message">
              <div>
                <WarningIcon primaryColor={colors.R500} size="xlarge" />
                <h2>Help Content Unavailable</h2>
                <p>
                  This content is currently unavailable. Please try again by
                  refreshing your browser.
                </p>
              </div>
            </ErrorContainer>
          )}
          {status === 'loading' && (
            <HelpLoading data-testid="loading">
              <Spinner />
            </HelpLoading>
          )}
          {data.length > 0 && (
            <HelpContent data-testid="help-content">
              {data.map(section => (
                <Section key={section.id} level={section.page.level}>
                  <header>
                    <Lozenge appearance="new">{section.page.numbering}</Lozenge>
                    <h4>{section.page.title}</h4>
                  </header>
                  {section.page.body && (
                    <Article
                      dangerouslySetInnerHTML={{
                        __html: sanitize(section.page.body, {
                          allowedTags: sanitize.defaults.allowedTags.concat([
                            'img',
                            'a',
                          ]),
                          allowedAttributes: {
                            img: ['src'],
                            a: ['href', 'rel'],
                          },
                          allowedSchemes: ['data', 'http', 'https'],
                          allowProtocolRelative: false,
                        }),
                      }}
                    />
                  )}
                </Section>
              ))}
            </HelpContent>
          )}
        </ModalDialog>
      )}
    </ModalTransition>
  );
}

HelpDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default HelpDialog;
