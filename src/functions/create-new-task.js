/* create a Twilio Function from this file 

name: Flex Dialpad Create New Task
path /create-new-task

Remove the checkmark from Check for valid Twilio signature

*/

exports.handler = function(context, event, callback) {

  const workspace = context.TWILIO_WORKSPACE_SID;
  const workflowSid = context.TWILIO_WORKFLOW_SID;

  let client = context.getTwilioClient();

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log(event);

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
          from: event.From,
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
