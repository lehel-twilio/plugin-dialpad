/* create a Twilio Function from this file

name: Flex Dialpad Create New Task
path /create-new-task

Remove the checkmark from Check for valid Twilio signature

*/

const axios = require('axios');

exports.handler = async function(context, event, callback) {

  const workspace = context.TWILIO_WORKSPACE_SID;
  const workflowSid = context.TWILIO_WORKFLOW_SID;

  let client = context.getTwilioClient();

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

  client
  .taskrouter.workspaces(workspace)
  .tasks
  .create(
    {
      attributes: JSON.stringify(
        {
          to: event.To,
          direction: 'outbound',
          name: 'Your Company Name Here',
          from: event.From,
          url: context.RUNTIME_DOMAIN,
          targetWorker: event.Worker,
          autoAnswer: 'true',
          internal: event.Internal
        }),
      workflowSid: workflowSid,
      taskChannel: 'custom1',
      timeout: 30
    })
  .then(task => {
    response.setBody( task.sid );
    callback(null, response);
  })
  .catch((error) => {
    console.log(error);
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
