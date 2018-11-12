exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();

  console.log(event);

  twiml.dial().conference({
    statusCallback: 'call-outbound-join',
    statusCallbackEvent: 'join',
    endConferenceOnExit: true
  },event.taskSid);
    callback(null, twiml);
};
