/* create a Twilio Function from this file 

name: Flex Dialpad Cleanup Rejected Task
path /cleanup-rejected-task

Remove the checkmark from Check for valid Twilio signature

*/

exports.handler = function(context, event, callback) {

    const workspace = context.TWILIO_WORKSPACE_SID;
    const taskSid = event.taskSid;

    let client = context.getTwilioClient();

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log(event);
    console.log(workspace);
    console.log(taskSid);

	client.taskrouter
      .workspaces(workspace)
      .tasks(taskSid)
      .update({
        assignmentStatus: 'wrapping',
        reason: 'internal call rejected'
      })
      .then(() => {
          console.log('Task cleanup successful');

          //Disconnect Conference call
          client
            .conferences
            .each({
                friendlyName: taskSid
            },
                conference => {
                    console.log(conference);

                    conference
                    .update({status: 'completed'})
                    .then(() => {
                        console.log('Conference disconnected');
                        callback(null, response);
                    })
                    .catch(error => {
                        console.log(error);
                        callback(error);
                    })
                }
            )
      })
      .catch(error => {
          console.log(error);
          callback(error);
      });
};
