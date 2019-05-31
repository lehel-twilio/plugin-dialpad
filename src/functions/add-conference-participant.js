/* create a Twilio Function from this file

name: Flex Dialpad Add Conference Participant
path /add-conference-participant

*/

const axios = require('axios');

exports.handler = async function(context, event, callback) {
	const client = context.getTwilioClient();
    const workspace = context.TWILIO_WORKSPACE_SID;
    const workflowSid = context.TWILIO_WORKFLOW_SID;

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

    Object.keys(event).forEach( thisEvent => console.log(`${thisEvent}: ${event[thisEvent]}`));

    if (event.to.substring(0, 6) === 'client') {

        client
          .taskrouter.workspaces(workspace)
          .tasks
          .create(
            {
              attributes: JSON.stringify(
                {
                  to: event.To,
                  direction: 'outbound',
                  name: 'Your company name here',
                  from: 'Your Twilio Number',
                  targetWorker: event.to,
                  url: context.RUNTIME_DOMAIN,
                  autoAnswer: 'false',
                  conferenceSid: event.taskSid
                }),
              workflowSid: workflowSid,
              taskChannel: 'custom1'
            })
          .then(task => {
            response.setBody( task.sid );
            callback(null, response);
          })
          .catch((error) => {
            console.log(error);
            callback(error);
          });
    } else {
        client
            .conferences(event.taskSid)
            .participants
            .create({
              to: event.to,
              from: event.from,
              earlyMedia: true,
              endConferenceOnExit: true
            })
            .then(participant => {
                console.log(participant);
                response.body = participant;

                callback(null, response);
            });
    }
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
