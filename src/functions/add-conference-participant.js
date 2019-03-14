exports.handler = function(context, event, callback) {
	const client = context.getTwilioClient();
    const workspace = context.TWILIO_WORKSPACE_SID;
    const workflowSid = context.TWILIO_WORKFLOW_SID;

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

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
