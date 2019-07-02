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

    //Place Task into wrapUp on remote party disconnect
    manager.voiceClient.on('disconnect', function(connection) {
      manager.workerClient.reservations.forEach(reservation => {
        if (reservation.task.attributes.worker_call_sid === connection.parameters.CallSid && reservation.task.taskChannelUniqueName === 'custom1' &&
              reservation.task.attributes.direction === 'outbound') {
          reservation.task.wrapUp();
        };
      });
    });

    //adds the dialer view
    flex.ViewCollection.Content.add(<flex.View name='dialer' key='dialpad1'><Dialpad key='dialpad2' insightsClient={manager.insightsClient} runtimeDomain={manager.serviceConfiguration.runtime_domain} jweToken={jweToken} mode='dialPad'/></flex.View>);
    flex.CallCanvas.Content.add(<Conference key='conference' insightsClient={manager.insightsClient} runtimeDomain={manager.serviceConfiguration.runtime_domain} jweToken={jweToken}/>);

    //adds the dial button to SMS
    flex.TaskCanvasHeader.Content.add(<CallButton key='callbutton' runtimeDomain={manager.serviceConfiguration.runtime_domain} jweToken={jweToken}/>);

    //create custom task TaskChannel
    const outboundVoiceChannel = flex.DefaultTaskChannels.createCallTaskChannel('custom1',
      (task) => task.taskChannelUniqueName === 'custom1');
    flex.TaskChannels.register(outboundVoiceChannel);

    registerCustomActions(manager.serviceConfiguration.runtime_domain, jweToken);

    //Add custom redux store
    manager.store.addReducer('dialpad', dialpadReducer);
  }
}
