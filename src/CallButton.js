import * as React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { css } from 'emotion'

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
          const workerContactUri = this.props.workerContactUri;
          const runtimeDomain = this.props.runtimeDomain;
          const from = this.props.from;

          if (number.length > 0) {

            const jweToken = this.props.manager.store.getState().flex.session.ssoTokenPayload.token;

            fetch(`https://${runtimeDomain}/create-new-task`, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: `From=${from}&To=${number}&Worker=${workerContactUri}&Token=${jweToken}`
            })
            .then(response => response.json())
            .then(json => {
              Actions.invokeAction('NavigateToView', {viewName: 'agent-desktop'});
              Actions.invokeAction('SelectTask', {taskSid: json});
            })
          } else {
            console.log('Invalid number dialed');
          }
        }}/>
      )
    }
  }

  render() {
    return <this.callButton/>
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    runtimeDomain: ownProps.runtimeDomain,
    from: state.flex.worker.attributes.phone,
    workerContactUri: state.flex.worker.attributes.contact_uri,
    activeCall: typeof(state.flex.phone.connection) === 'undefined' ? '' : state.flex.phone.connection.source,
    isMuted: typeof(state.flex.phone.connection) === 'undefined' ? false : state.flex.phone.connection.source.mediaStream.isMuted,
    activeView: state.flex.view.activeView
  }
}

export default connect(mapStateToProps)(CallButton)
