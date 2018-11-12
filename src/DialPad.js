import React from 'react';

import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { css } from 'react-emotion';
import styled from 'react-emotion';

import IconButton from '@material-ui/core/IconButton';
import Phone from '@material-ui/icons/Phone';
import CallEnd from '@material-ui/icons/CallEnd';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Backspace from '@material-ui/icons/Backspace';

const dialercontainer = css`
  height: 400px;
  background-color: #FFFFFF;
`

const agentdesktop = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const numpadcontainer = css`
  align-self: center;
`

const screen = css`
  width: 100%;
  height: 10%;
  background-color: white;
  color: #9E9E9E;
  font-weight: 100;
`

const buttonRow = css`
  width: 100%;
  display: flex;
  color: #000000 !important;
`

const plus = css`
  overflow: hidden;
  width: 15px;
  text-overflow: ellipsis;
  direction: rtl;
  font-size: 3.5vh !important;
`

const screenMainLine = css`
  overflow: hidden;
  width: 205px;
  text-overflow: ellipsis;
  direction: rtl;
  font-size: 3.5vh !important;
`

const screenWrapper = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 20px;
`

const Button = styled('button')`
  background-color: #FFFFFF !important;
  width: 100px;
  height: 40px;
  color: #000000;
  border: 0;
  background: none;
  box-shadow: none;
  border-radius: 0px;
  font-size: 1.5vh;
  font: Roboto;
  &:hover {
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    outline: 0;
  }
  &:focus {
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    outline: 0;
  }
  &:active {
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    outline: 0;
  }
`

const iconbuttons = css`
  display: contents !important;
`

const functionbuttons = css`
  margin: 20px;
`

const volumebutton = css`
  margin: 20px;
`

const hangupbutton = css`
  margin: 20px;
`

const dialbutton = css``

const backspacebutton = css``

export class DialPad extends React.Component {

  state = {
    screenMainLine: ''
  }

  componentDidMount() {
    if (typeof this.props.content === "undefined") { //Only listen on the Dialer page
      document.addEventListener("keyup", this.eventlistener, false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.eventlistener, false);
  }

  eventlistener = (e) => this.keyPressListener(e);

  keyPressListener(e) {
    if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 187) { //listen to 0-9 & +
      this.buttonPress(e.key, this.props.activeCall);
    } else if (e.keyCode === 8) { //listen for backspace
      this.backspace();
    } else if (e.keyCode === 13) { //listen for enter
      const number = this.state.plus === 'undefined' ? this.state.screenMainLine : `+${this.state.screenMainLine}`;
      this.dial(number, this.props.url, this.props.from, this.props.workerContactUri);
    }
  }

  buttonPress(key, activeCall) {
    if (activeCall.length > 0) {
      activeCall[0].source.sendDigits(key);
    }

    if (key === '+') {
      this.setState({plus: this.state.plus === "+" ? "" : "+"});
    } else {
      this.setState({screenMainLine: (typeof this.state.screenMainLine === "undefined" ? key : this.state.screenMainLine + key)});
    }
  }

  backspace() {
    this.setState({screenMainLine: this.state.screenMainLine.substring(0, this.state.screenMainLine.length - 1)});
  }

  dial(number, url, from, workerContactUri) {

    fetch(`${url}/create-new-task`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `From=${from}&To=${number}&Worker=${workerContactUri}&Url=${url}`
    })
    .then(response => response.json())
    .then(json => {
      Actions.invokeAction("NavigateToView", {viewName: "agent-desktop"});
      Actions.invokeAction("SelectTask", {taskSid: json});
    })
  }

  numbers = [
    [ '1', '2', '3' ],
    [ '4', '5', '6' ],
    [ '7', '8', '9' ],
    [ '*', '0', '#' ]
  ];

  buttons = this.numbers.map((row, i) => {
    let originalThis = this;

    return (<div className={buttonRow} key={i}>

      {
        row.map(function(item, i) {
          return (<Button key={item} onClick={e => originalThis.buttonPress(item, originalThis.props.activeCall)}>{item}</Button>);
        })
      }

    </div>)
  })

  functionButtons = () => {
    if (this.props.activeView === "agentdesktop") {
      return (<div/>)
    } else if (this.props.activeCall.length > 0) {
      if (this.props.isMuted) {
        return (<div>
          <VolumeMute className={volumebutton} onClick={e => Actions.invokeAction("ToggleMute")}/>
          <CallEnd className={hangupbutton} onClick={e => Actions.invokeAction("HangupCall")}/>
        </div>);
      } else {
        return (<div>
          <VolumeUp className={volumebutton} onClick={e => Actions.invokeAction("ToggleMute")}/>
          <CallEnd className={hangupbutton} onClick={e => Actions.invokeAction("HangupCall")}/>
        </div>);
      }
    } else {
      return (<div>
        <Phone className={dialbutton} onClick={e => {
          const number = this.state.plus === 'undefined' ? this.state.screenMainLine : `+${this.state.screenMainLine}`;
          this.dial(number, this.props.url, this.props.from, this.props.workerContactUri);
        }} />
      </div>);
    }
  }

  screen = () => {
    if (this.props.activeView === "agent-desktop" || this.props.activeView === "agentdesktop") { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (<div className={screen}>
        <div className={screenWrapper}>
          <p className={plus}>{this.state.plus}</p>
          <p className={screenMainLine}>{this.state.screenMainLine}</p>
          <Backspace className={backspacebutton} onClick={e => this.backspace()}/>
        </div>
      </div>)
    }
  }

  plusButton = () => {
    if (this.props.activeView === "agent-desktop" || this.props.activeView === "agentdesktop") { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (<div>
        <Button key="placeHolder" > </Button>
        <Button key="+" onClick={e => this.buttonPress("+", this.props.activeCall)}>+</Button>
        <Button key="placeHolder2" > </Button>
      </div>)
    }
  }

  render() {
    return (
      <div>
        <div className={(this.props.activeView === "agent-desktop" || this.props.activeView === "agentdesktop") ? agentdesktop : dialercontainer} >
        <this.screen/>
        <div className={numpadcontainer}>
          {this.buttons.map((button) => (button))}
          <this.plusButton/>
        </div>
        <div className={functionbuttons}>
          <IconButton color="inherit" className={iconbuttons} component="div">
            <this.functionButtons/>
          </IconButton>
        </div>
      </div>
    </div>
  )}
}

const mapStateToProps = state => {
  return {
    url: state.flex.config.serviceBaseUrl.slice(0,5) === 'https'
      ? (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)
      : ("https://" + (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)),
    from: state.flex.worker.attributes.phone,
    workerContactUri: state.flex.worker.attributes.contact_uri,
    activeCall: state.flex.phone.connections,
    isMuted: state.flex.phone.connections.length > 0 ? state.flex.phone.connections[0].source.mediaStream.isMuted : false,
    activeView: state.flex.view.activeView
  }
}

export default connect(mapStateToProps)(DialPad)
