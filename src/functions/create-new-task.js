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
          name: 'Your Company Name',
          from: event.From,
          url: event.Url,
          targetWorker: event.Worker,
          autoAnswer: 'true'
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
};
