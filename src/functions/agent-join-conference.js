/* create a Twilio Function from this file 

name: Flex Dialpad Agent Join 3rd Participan
path /agent-join-conference

*/

exports.handler = function(context, event, callback) {
	let twiml = new Twilio.twiml.VoiceResponse();

    console.log(event);

    twiml.dial().conference(event.conferenceSid);
    callback(null, twiml);
};
