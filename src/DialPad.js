import React from 'react';

import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { css } from 'react-emotion';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Phone from '@material-ui/icons/Phone';
import CallEnd from '@material-ui/icons/CallEnd';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Backspace from '@material-ui/icons/Backspace';

const dialerContainer = css`
  height: 400px;
  background-color: #FFFFFF;
`

const agentDesktop = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const numpadContainer = css`
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
  font-size: 26px !important;
`

const screenMainLine = css`
  ${plus};
  width: 205px;
`

const screenWrapper = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 20px;
`

const iconButtons = css`
  display: contents !important;
`

const functionButtons = css`
  margin: 20px;
`

const volumeButton = css`
  margin: 20px;
`

const hangupButton = css`
  margin: 20px;
`

const dialButton = css``

const backspaceButton = css``

export class DialPad extends React.Component {

  state = {
    screenMainLine: ''
  }

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

  backspace() {
    this.setState({screenMainLine: this.state.screenMainLine.substring(0, this.state.screenMainLine.length - 1)});
  }

  dial(number, url, from, workerContactUri) {

    if (number.length > 0) {

      fetch(`${url}/create-new-task`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: `From=${from}&To=${number}&Worker=${workerContactUri}&Url=${url}`
      })
      .then(response => response.json())
      .then(json => {
        Actions.invokeAction('NavigateToView', {viewName: 'agent-desktop'});
      })
    } else {
      console.log('Invalid number dialed');
    }
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

  functionButtons = () => {
    if (this.props.activeView === 'agentdesktop') {
      return (<div/>)
    } else if (this.props.activeCall.length > 0) {
      if (this.props.isMuted) {
        return (<div>
          <VolumeMute className={volumeButton} onClick={e => Actions.invokeAction('ToggleMute')}/>
          <CallEnd className={hangupButton} onClick={e => Actions.invokeAction('HangupCall')}/>
        </div>);
      } else {
        return (<div>
          <VolumeUp className={volumeButton} onClick={e => Actions.invokeAction('ToggleMute')}/>
          <CallEnd className={hangupButton} onClick={e => Actions.invokeAction('HangupCall')}/>
        </div>);
      }
    } else {
      return (<div>
        <Phone className={dialButton} onClick={e => {
          const number = (typeof this.state.plus === 'undefined') ? this.state.screenMainLine : `+${this.state.screenMainLine}`;
          this.setState({screenMainLine: ''});
          if (number !== '') {
            this.dial(number, this.props.url, this.props.from, this.props.workerContactUri);
          };
        }} />
      </div>);
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

  render() {
    return (
      <div>
        <div className={(this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') ? agentDesktop : dialerContainer} >
        <this.screen/>
        <div className={numpadContainer}>
          {this.buttons.map((button) => (button))}
          <this.plusButton/>
        </div>
        <div className={functionButtons}>
          <IconButton color='inherit' className={iconButtons} component='div'>
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
      : ('https://' + (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)),
    from: state.flex.worker.attributes.phone,
    workerContactUri: state.flex.worker.attributes.contact_uri,
    activeCall: state.flex.phone.connections,
    isMuted: state.flex.phone.connections.length > 0 ? state.flex.phone.connections[0].source.mediaStream.isMuted : false,
    activeView: state.flex.view.activeView
  }
}

export default connect(mapStateToProps)(DialPad)
