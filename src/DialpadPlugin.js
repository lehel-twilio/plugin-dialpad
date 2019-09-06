import { FlexPlugin } from 'flex-plugin';
import React from 'react';

import CallButton from './CallButton';
import Conference from './Conference';
import DialerButton from './DialerButton';
import Dialpad from './Dialpad';

import dialpadReducer from './reducers/DialpadReducer.js';
import registerCustomActions from './CustomActions';

export default class DialpadPlugin extends FlexPlugin {
  name = 'DialpadPlugin';

  init(flex, manager) {

    // get the JWE for authenticating the worker in our Function
    const jweToken = manager.store.getState().flex.session.ssoTokenPayload.token;

    //const functionsUrl = 'eb0deeab.ngrok.io';
    const functionsUrl = 'plugin-dialpad-functions-7507-dev.twil.io';

    //adds the dial button to the navbar
    flex.SideNav.Content.add(<DialerButton key='sidebardialerbutton'/>);

    //auto-accepts tasks
    manager.workerClient.on('reservationCreated', reservation => {
      if (reservation.task.attributes.autoAnswer === 'true') {
        flex.Actions.invokeAction('AcceptTask', {sid: reservation.sid});
        //select the task
        flex.Actions.invokeAction('SelectTask', {sid: reservation.sid});
      }
    });

    //adds the dialer view
    flex.ViewCollection.Content.add(<flex.View name='dialer' key='dialpad1'><Dialpad key='dialpad2' insightsClient={manager.insightsClient} runtimeDomain={functionsUrl} jweToken={jweToken} mode='dialPad'/></flex.View>);
    flex.CallCanvas.Content.add(<Conference key='conference' insightsClient={manager.insightsClient} runtimeDomain={functionsUrl} jweToken={jweToken}/>);

    //adds the dial button to SMS
    flex.TaskCanvasHeader.Content.add(<CallButton key='callbutton' runtimeDomain={functionsUrl} jweToken={jweToken}/>);

    //create custom task TaskChannel
    const outboundVoiceChannel = flex.DefaultTaskChannels.createCallTaskChannel('custom1',
      (task) => task.taskChannelUniqueName === 'custom1');
    flex.TaskChannels.register(outboundVoiceChannel);

    registerCustomActions(functionsUrl, jweToken);

    //Add custom redux store
    manager.store.addReducer('dialpad', dialpadReducer);
  }
}
