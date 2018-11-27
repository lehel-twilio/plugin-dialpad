import * as React from "react";
import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { css } from 'react-emotion';

import Call from '@material-ui/icons/Call';

const callbutton = css`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 2px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 2px;
  margin: 6px 1px;
  border-radius: 50%;
`

export class CallButton extends React.Component {

  callButton = (props) => {
    if (this.props.task.channelType !== 'sms') { //Only render the call button for SMS
      return <div/>;
    } else {
      return (
        <Call {...this.props} className={callbutton} onClick={e => {
          const number = this.props.task.defaultFrom;
          const url = this.props.url;
          const workerContactUri = this.props.workerContactUri;
          const from = this.props.from;

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
              Actions.invokeAction("NavigateToView", {viewName: "agent-desktop"});
              Actions.invokeAction("SelectTask", {taskSid: json});
            })
          } else {
            console.log("Invalid number dialed");
          }
        }}/>
      )
    }
  }

  render() {
    return <this.callButton/>
  }
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

export default connect(mapStateToProps)(CallButton)
