import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { withTaskContext } from '@twilio/flex-ui';

import sharedTheme from '../styling/theme.js';
import CallEnd from '@material-ui/icons/CallEnd';
import Forward from '@material-ui/icons/Forward';
import IconButton from '@material-ui/core/IconButton';
import Phone from '@material-ui/icons/Phone';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { withStyles } from '@material-ui/core/styles';

import { setScreenMainLine } from '../actions/DialpadActions';
import { addConferenceParticipant, dial } from '../helpers';

const styles = theme => (sharedTheme(theme));

class FunctionButtons2 extends React.Component {

  functionButtons = () => {

    const { classes } = this.props;

    if (this.props.mode === 'conference') {
      return (
        <div>
          <Forward className={classes.functionButton} onClick={e => {
            const number = (typeof this.props.plus === 'undefined') ? this.props.screenMainLine : `+${this.props.screenMainLine}`;
            this.props.setScreenMainLine('');
            addConferenceParticipant(number, this.props);
          }}/>
        </div>
      )
    } else if (this.props.activeCall.length > 0) {
      if (this.props.isMuted) {
        return (
          <div>
            <VolumeMute className={classes.functionButton} onClick={e => Actions.invokeAction('ToggleMute')}/>
            <CallEnd className={classes.functionButton} onClick={e => Actions.invokeAction('HangupCall')}/>
          </div>
        );
      } else {
        return (
          <div>
            <VolumeUp className={classes.functionButton} onClick={e => Actions.invokeAction('ToggleMute')}/>
            <CallEnd className={classes.functionButton} onClick={e => Actions.invokeAction('HangupCall')}/>
          </div>
        );
      }
    } else {
      return (
        <div>
          <Phone className={classes.functionButton} onClick={e => {
            const number = (typeof this.props.plus === 'undefined') ? this.props.screenMainLine : `+${this.props.screenMainLine}`;
            this.props.setScreenMainLine('');
            dial(number, this.props);
          }}/>
        </div>
      );
    }
  }

  render() {

    const { classes } = this.props;

    return (
      <div className="function-buttons">
        <IconButton color='inherit' className={classes.functionButton} component='div'>
          <this.functionButtons/>
        </IconButton>
      </div>
    );
  }
}

const FunctionButtons = withTaskContext(FunctionButtons2);

const mapStateToProps = (state) => {
  return {
    activeCall: state.flex.phone.connections,
    directoryWorker: state.dialpad.directoryWorker,
    from: state.flex.worker.attributes.phone,
    screenMainLine: state.dialpad.screenMainLine,
    workerContactUri: state.flex.worker.attributes.contact_uri,
    workerName: state.flex.worker.attributes.full_name,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  setScreenMainLine: (value) => dispatch(setScreenMainLine(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FunctionButtons));
