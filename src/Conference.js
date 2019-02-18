import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { withTaskContext } from "@twilio/flex-ui";
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GroupAdd from '@material-ui/icons/GroupAdd';
import GridOn from '@material-ui/icons/GridOn';
import Backspace from '@material-ui/icons/Backspace';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

const iconButtons = css`
  display: contents !important;
`

const conferenceButton = css`
  margin: 20px;
`

const keypadButton = css`
  margin: 20px;
`

const wrapper = css`
  height: 400px;
`

const dialpadKeypad = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const conferenceKeypad = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const numpadContainer = css`
  align-self: center;
`

const buttonRow = css`
  width: 100%;
  display: flex;
  color: #000000 !important;
`

const screen = css`
  width: 100%;
  height: 10%;
  color: #9E9E9E;
  font-weight: 100;
`

const screenWrapper = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 20px;
`

const plus = css`
  overflow: hidden;
  width: 15px;
  text-overflow: ellipsis;
  direction: rtl;
  font-size: 26px !important;
`

const screenMainLine = css`
  ${plus};
  width: 205px;
`

const backspaceButton = css``

export class ConferenceButton2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'none',
      screenMainLine: ''
    }
  };

  componentDidMount() {
    if (typeof this.props.content === 'undefined') { //Only listen on the Dialer page
      document.addEventListener('keyup', this.eventListener, false);
      document.addEventListener('paste', this.pasteListener, false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.eventListener, false);
    document.removeEventListener('paste', this.pasteListener, false);
  }

  eventListener = (e) => this.keyPressListener(e);

  pasteListener = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,''); //strip all non numeric characters from paste
    this.setState({screenMainLine: (typeof this.state.screenMainLine === 'undefined' ? paste : this.state.screenMainLine + paste)});
  }

  numbers = [
    [ '1', '2', '3' ],
    [ '4', '5', '6' ],
    [ '7', '8', '9' ],
    [ '*', '0', '#' ]
  ];

  buttons = this.numbers.map((row, i) => {
    let originalThis = this;

    return (
      <div className={buttonRow} key={i}>
      {
        row.map(function(item, i) {
          return (<Button size='large' key={item} onClick={e => originalThis.buttonPress(item, originalThis.props.activeCall)}>{item}</Button>);
        })
      }
    </div>)
  })

  dialPad = () => {
    const { classes } = this.props;

    if (this.state.mode === 'dialpad') {
      return (
        <div className={dialpadKeypad}>
          <div className={numpadContainer}>
            {this.buttons.map((button) => (button))}
          </div>
        </div>
      )
    } else if (this.state.mode === 'conference') {
      return (
        <div className={conferenceKeypad}>
          <this.screen/>
          <TextField
            id="outlined-search"
            label="Search"
            type="search"
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <div className={numpadContainer}>
            {this.buttons.map((button) => (button))}
          </div>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }

  screen = () => {
    if (this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (<div className={screen}>
        <div className={screenWrapper}>
          <p className={plus}>{this.state.plus}</p>
          <p className={screenMainLine}>{this.state.screenMainLine}</p>
          <Backspace className={backspaceButton} onClick={e => this.backspace()}/>
        </div>
      </div>)
    }
  }

  plusButton = () => {
    if (this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (<div>
        <Button size='large' key='placeHolder' > </Button>
        <Button size='large' key='+' onClick={e => this.buttonPress('+', this.props.activeCall)}>+</Button>
        <Button size='large' key='placeHolder2' > </Button>
      </div>)
    }
  }

  keyPressListener(e) {
    if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 187) { //listen to 0-9 & +
      this.buttonPress(e.key, this.props.activeCall);
    } else if (e.keyCode === 8) { //listen for backspace
      this.backspace();
    } else if (e.keyCode === 13) { //listen for enter
      const number = (typeof this.state.plus === 'undefined') ? this.state.screenMainLine : `+${this.state.screenMainLine}`;
      this.setState({screenMainLine: ''});
      if (number !== '') {
        this.dial(number, this.props.url, this.props.from, this.props.workerContactUri);
      };
    }
  }

  backspace() {
    this.setState({screenMainLine: this.state.screenMainLine.substring(0, this.state.screenMainLine.length - 1)});
  }

  buttonPress(key, activeCall) {
    if (activeCall.length > 0) {
      activeCall[0].source.sendDigits(key);
    }

    if (key === '+') {
      this.setState({plus: this.state.plus === '+' ? '' : '+'});
    } else {
      this.setState({screenMainLine: (typeof this.state.screenMainLine === 'undefined' ? key : this.state.screenMainLine + key)});
    }
  }

  addConferenceParticipant() {

    console.log('Conference Button pressed');

    fetch(`${this.props.url}/add-conference-participant`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `taskSid=${this.props.task.taskSid}&from=${this.props.from}&to=+18009505114`
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
  }

  displayDialpad() {
    console.log('Dialpad button clicked');
    this.setState({ mode: this.state.mode === 'dialpad' ? 'none' : 'dialpad' });
  }

  displayConferenceKeypad() {
    console.log('Conference button clicked');
    this.setState({ mode: this.state.mode === 'conference' ? 'none' : 'conference' });
  }

  render() {
    return (
      <div className={wrapper}>
        <IconButton color='inherit' className={iconButtons} component='div'>
          <GroupAdd className={conferenceButton} onClick={e => this.displayConferenceKeypad()}/>
          <GridOn className={keypadButton} onClick={e => this.displayDialpad()}/>
        </IconButton>
        <this.dialPad/>
      </div>
    )
  }
};

ConferenceButton2.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ConferenceButton = withTaskContext(ConferenceButton2);

const mapStateToProps = state => {
  return {
    url: state.flex.config.serviceBaseUrl.slice(0,5) === 'https'
      ? (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)
      : ('https://' + (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)),
    from: state.flex.worker.attributes.phone,
    activeCall: state.flex.phone.connections,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ConferenceButton));
