/* create a Twilio Function from this file

name: Flex Dialpad Hold Call
path /hold-call

Remove the checkmark from Check for valid Twilio signature

*/

const axios = require('axios');

exports.handler = async function(context, event, callback) {

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const authed = await validateToken(event.Token, context.ACCOUNT_SID, context.AUTH_TOKEN);
  if (typeof authed !== 'object' || !authed.data || authed.data.valid !== true) {
    console.log('couldn\'t auth', event.Token);
    return callback(null, response);
  }

  console.log('successfully authed', authed.data)

  const conference = event.conference;
  const participant = event.participant;
  const hold = event.hold;
  if (!conference || !participant || !hold) {
    response.statusCode = 400;
    response.body = 'Conference, participant or hold param(s) not set';
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

async function validateToken(token, accountSid, authToken) {
  try {
    return await axios.post(
      `https://iam.twilio.com/v1/Accounts/${accountSid}/Tokens/validate`,
      { token: token },
      { auth: { username: accountSid, password: authToken } }
    )
  } catch (e) {
    console.error('failed to validate token', e.response.data);
    throw e;
  }
}
