exports.handler = function(context, event, callback) {
  console.log(event);

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const conference = event.conference;
  const participant = event.participant;
  const hold = event.hold;
  if (!conference || !participant || !hold) {
    response.statusCode = 400;
    response.body = "Conference, participant or hold param(s) not set";
    callback(null, response);
  }

  const client = context.getTwilioClient();
  client
    .conferences(conference)
    .participants(participant)
    .update({
      hold: hold
    })
    .then(participant => {
      callback(null, response);
    })
    .catch(error => {
      callback(error);
    });
};
