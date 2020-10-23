import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

export const HelpLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HelpContent = styled.div`
  & img {
    width: 100%;
    height: auto;
  }
`;

export const ErrorContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    text-align: center;
  }
`;

export const Section = styled.section`
  display: block;
  overflow: hidden;
  clear: both;
  ${props => `margin-left: ${(props.level - 1) * 40}px;`}

  & header {
    margin: 10px 0;
    display: flex;
    align-items: baseline;

    & h4 {
      margin: 0 0 0 10px;
    }
  }
`;

export const Article = styled.article`
  margin-bottom: 30px;

  & pre {
    padding: 0.75rem;
    background-color: ${colors.Y75};
    border: 1px solid ${colors.Y100};
    border-radius: ${borderRadius()}px;
  }

  & table tbody {
    border-bottom: 1px solid ${colors.N50};
  }

  & table td {
    padding: 0.75rem;
    border-top: 1px solid ${colors.N50};
    vertical-align: top;
  }
`;
