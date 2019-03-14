const fetchTask = (client, context, taskSid) => {
  return client.taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .fetch();
};

const updateTaskAttributes = (client, context, taskSid, attributes) => {
  return client.taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .update({
      attributes: JSON.stringify(attributes)
    });
};

const addParticipantToConference = (client, context, conferenceSid, taskSid, to, from) => {

  //internal call
  if (to.substring(0, 6) === 'client') {
    return client
      .taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks
      .create(
        {
          attributes: JSON.stringify(
            {
              to: to,
              direction: 'outbound',
              name: from,
              from: 'Enter a Twilio Number here',
              targetWorker: to,
              url: context.RUNTIME_DOMAIN,
              autoAnswer: 'false',
              conferenceSid: taskSid,
              internal: 'true'
            }),
          workflowSid: context.TWILIO_WORKFLOW_SID,
          taskChannel: 'custom1'
        })
  } else {
    return client
        .conferences(conferenceSid)
        .participants.create({
          to: to,
          from: from,
          earlyMedia: true,
          endConferenceOnExit: true
        });
  }
};

exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const taskSid = event.FriendlyName;

  let attributes = {};

  if (event.StatusCallbackEvent === 'participant-join') {
    console.log(`callSid ${event.CallSid} joined, task is ${taskSid}, conference is ${event.ConferenceSid}`);

    client.calls(event.CallSid)
      .fetch()
      .then(call => {
        if (call.to.includes('client')) {
          console.log(`agent ${call.to} joined the conference`);

          return fetchTask(client, context, taskSid).then(task => {
            attributes = {...JSON.parse(task.attributes)
            }

            attributes.conference = {
              sid: event.ConferenceSid,
              participants: {
                worker: event.CallSid
              }
            };

            console.log(attributes);

            //Check to see if this is a third participant added to the call, if yes, don't place an outbound call. This is used by the Conference plugin.
            if (attributes.worker_call_sid !== attributes.conference.participants.worker) {
                console.log('This is a 3rd participant, nothing to do here');
                callback();
            }

            return [attributes.to, attributes.from];

          }).then(([to, from]) => {
            console.log(`initiate outbound call to: ${attributes.to}`);

            if (to.length == 10) {
                to = `1${to}`;
            }

            return addParticipantToConference(client, context, event.ConferenceSid, taskSid, to, from);

          }).then(result => {
            if (result.assignmentStatus === 'pending') {
                return;
            } else {

                console.log(`call triggered, callSid ${participant.callSid}`);

                attributes.conference.participants.customer = participant.callSid;

                return updateTaskAttributes(client, context, taskSid, attributes);

            }

          }).then(task => {
            console.log(task);

            if (typeof(task) === 'undefined') {
                return;
            } else {

                console.log(`updated task ${taskSid} with new attributes: ${JSON.stringify(attributes)}`);
                return;

            }

          }).catch(error => {
            console.log('an error occurred', error);
            callback(error);
          });

        } else {
          console.log('the customer joined, nothing to do here');
          return;
        }

      }).then(() => {
        console.log('all tasks done');
        callback();

      }).catch(error => {
        console.log('an error occurred', error);
        callback(error);
      });
  } else if (event.StatusCallbackEvent === 'conference-end') {
    return client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks(taskSid)
      .update({
        assignmentStatus: 'wrapping',
        reason: 'conference ended'
      })
      .then(() => callback(null, null))
      .catch(error => callback(error));
  } else {
    callback();
  }
};
