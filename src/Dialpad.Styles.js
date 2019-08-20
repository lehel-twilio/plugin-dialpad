import styled from 'react-emotion';

export const DialpadStyles = styled('div')`
  width: 100%;
  background-color: ${props => props.isConference ? 'inherit': props.theme.colors.base1};
  display: flex;
  flex-direction: column;
  text-align:center;
  .buttons-container {
    align-self: center;
  }
  .dialpad-container {
    max-width: 300px;
  }
  .directory-select {
    margin: 8px 0px;
  }
  .function-buttons {
    align-self: center;
    justify-content: center;
    padding: 0;
    color: ${props => props.theme.colors.base10};
  }
`

export const ConferenceStyles = styled('div')`
  height: 400px;
  text-align: center;
  .icon-buttons {
    display: contents;
  }
  .icon {
    margin: 20px;
  }
  .inline-block {
    display: inline-block;
  }
`;
