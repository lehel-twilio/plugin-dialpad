import React from 'react';
import { css } from 'emotion';
import Dialpad from './Dialpad';

import IconButton from '@material-ui/core/IconButton';
import GroupAdd from '@material-ui/icons/GroupAdd';

const wrapper = css`
  height: 400px;
`

const iconButtons = css`
  display: contents !important;
`

const conferenceButton = css`
  margin: 20px;
`

class Conference extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dialPadMode: 'none' }
  };

  displayConferenceKeypad() {
    this.setState({ dialPadMode: this.state.dialPadMode === 'conference' ? 'none' : 'conference' });
  }

  render() {
    return (
      <div className={wrapper}>
        <IconButton color='inherit' className={iconButtons} component='div'>
          <GroupAdd className={conferenceButton} onClick={e => this.displayConferenceKeypad()}/>
        </IconButton>
        <Dialpad key='dialpad' insightsClient={this.props.insightsClient} runtimeDomain={this.props.runtimeDomain} manager={this.props.manager} mode={this.state.dialPadMode}/>
      </div>
    );
  }
}

export default Conference;
