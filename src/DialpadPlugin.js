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

    //Get the Functions v2 runtime domain from Flex configuration
    const functionsUrl = manager.configuration.dialpadDomain;
    console.log(`Functions v2 runtime domain: ${functionsUrl}`);

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
    flex.ViewCollection.Content.add(<flex.View name='dialer' key='dialpad1'><Dialpad key='dialpad2' insightsClient={manager.insightsClient} runtimeDomain={functionsUrl} manager={manager} mode='dialPad'/></flex.View>);
    flex.CallCanvas.Content.add(<Conference key='conference' insightsClient={manager.insightsClient} runtimeDomain={functionsUrl} manager={manager}/>);

    //adds the dial button to SMS
    flex.TaskCanvasHeader.Content.add(<CallButton key='callbutton' runtimeDomain={functionsUrl} manager={manager}/>);

    //create custom task TaskChannel
    const outboundVoiceChannel = flex.DefaultTaskChannels.createCallTaskChannel('custom1',
      (task) => task.taskChannelUniqueName === 'custom1');
    flex.TaskChannels.register(outboundVoiceChannel);

    registerCustomActions(functionsUrl, manager);

    //Add custom redux store
    manager.store.addReducer('dialpad', dialpadReducer);
  }
}
