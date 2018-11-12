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

const addParticipantToConference = (client, context, conferenceSid, to, from) => {
  return client
    .conferences(conferenceSid)
    .participants.create({
      to: to,
      from: from,
      earlyMedia: true,
      endConferenceOnExit: true
    });
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

            return [attributes.to, attributes.from];

          }).then(([to, from]) => {
            console.log(`initiate outbound call to: ${attributes.to}`);
            console.log(to);
            console.log(from);

            if (to.length == 10) {
                to = `1${to}`;
            }

            return addParticipantToConference(client, context, event.ConferenceSid, to, from);

          }).then(participant => {
            console.log(`call triggered, callSid ${participant.callSid}`);

            attributes.conference.participants.customer = participant.callSid;

            return updateTaskAttributes(client, context, taskSid, attributes);

          }).then(task => {
            console.log(`updated task ${taskSid} with new attributes: ${JSON.stringify(attributes)}`);
            return;

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

  } else {
    callback();
  }
};
