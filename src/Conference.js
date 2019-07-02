import React from 'react';
import { css } from 'emotion';
import Dialpad from './Dialpad';

import IconButton from '@material-ui/core/IconButton';
import GroupAdd from '@material-ui/icons/GroupAdd';
import GridOn from '@material-ui/icons/GridOn';

const wrapper = css`
  height: 400px;
`

const iconButtons = css`
  display: contents !important;
`

const conferenceButton = css`
  margin: 20px;
`

const keypadButton = css`
  margin: 20px;
`

class Conference extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dialPadMode: 'none' }
  };

  displayDialpad() {
    this.setState({ dialPadMode: this.state.dialPadMode === 'dtmf' ? 'none' : 'dtmf' });
  }

  displayConferenceKeypad() {
    this.setState({ dialPadMode: this.state.dialPadMode === 'conference' ? 'none' : 'conference' });
  }

  render() {
    return (
      <div className={wrapper}>
        <IconButton color='inherit' className={iconButtons} component='div'>
          <GroupAdd className={conferenceButton} onClick={e => this.displayConferenceKeypad()}/>
          <GridOn className={keypadButton} onClick={e => this.displayDialpad()}/>
        </IconButton>
        <Dialpad key='dialpad' insightsClient={this.props.insightsClient} runtimeDomain={this.props.runtimeDomain} jweToken={this.props.jweToken} mode={this.state.dialPadMode}/>
      </div>
    );
  }
}

export default Conference;
