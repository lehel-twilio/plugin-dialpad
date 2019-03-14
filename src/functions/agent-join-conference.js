exports.handler = function(context, event, callback) {
	let twiml = new Twilio.twiml.VoiceResponse();

    console.log(event);

    twiml.dial().conference(event.conferenceSid);
    callback(null, twiml);
};
