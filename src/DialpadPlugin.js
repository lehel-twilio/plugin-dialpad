import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import * as Flex from '@twilio/flex-ui';
import DialPad from './DialPad';
import DialerButton from './DialerButton';
import CallButton from './CallButton';
import './CustomActions';

export default class DialpadPlugin extends FlexPlugin {
  pluginName = 'DialpadPlugin';

  init(flex, manager) {
    //adds the dial button to the navbar
    flex.SideNav.Content.add(<DialerButton key="sidebardialerbutton"/>);

    //auto-accepts tasks
    manager.workerClient.on("reservationCreated", reservation => {
      if (reservation.task.attributes.autoAnswer === 'true') {
        Flex.Actions.invokeAction("AcceptTask", {sid: reservation.sid});
      }
    });

    //Place Task into wrapUp on remote party disconnect
    manager.voiceClient.on("disconnect", function(connection) {
      manager.workerClient.reservations.forEach(reservation => {
        if (reservation.task.attributes.worker_call_sid === connection.parameters.CallSid && reservation.task.taskChannelUniqueName === "custom1" &&
              reservation.task.attributes.direction === "outbound") {
          reservation.task.wrapUp();
        };
      });
    });

    //adds the dialer view
    flex.ViewCollection.Content.add(<flex.View name="dialer" key="dialpad1"><DialPad key="dialpad2"/></flex.View>);
    flex.CallCanvas.Content.add(<DialPad key="dialpad3"/>);

    //adds the dial button to SMS
    flex.TaskCanvasHeader.Content.add(<CallButton key="callbutton"/>);

    //create custom task TaskChannel
    const outboundVoiceChannel = Flex.DefaultTaskChannels.createCallTaskChannel("custom1",
      (task) => task.taskChannelUniqueName === "custom1");
    Flex.TaskChannels.register(outboundVoiceChannel);
  }
}
