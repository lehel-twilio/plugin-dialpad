import { Actions } from '@twilio/flex-ui';

Actions.replaceAction('AcceptTask', (payload, original) => {
  return new Promise((resolve, reject) => {
    const reservation = payload.task.sourceObject;

    if (payload.task.taskChannelUniqueName === 'custom1' && payload.task.attributes.direction === 'outbound') {
      //Join existing conference as 3rd particpant
      if (typeof(reservation.task.attributes.conferenceSid) !== 'undefined') {
        reservation.call(reservation.task.attributes.from,
          `${payload.task.attributes.url}/agent-join-conference?conferenceSid=${reservation.task.attributes.conferenceSid}`, {
            accept: true
          }
        )
      } else { //Place outbound call
        reservation.call(reservation.task.attributes.from,
          `${payload.task.attributes.url}/agent-outbound-join?taskSid=${payload.task.taskSid}`, {
            accept: true
          }
        )
      }

    } else {
      original(payload)
    }
    resolve();
  })
})

Actions.replaceAction('RejectTask', (payload, original) => {
  return new Promise((resolve, reject) => {

    if (payload.task.attributes.internal === 'true') {
      payload.task._reservation.accept();
      payload.task.wrapUp();
      payload.task.complete();

      const taskSid = payload.task.attributes.conferenceSid;
      //cleanup the outgoing call
      fetch(`${payload.task.attributes.url}/cleanup-rejected-task`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: `taskSid=${taskSid}`
      })
      .then(response => {
        console.log('Outbound call has been placed into wrapping');
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      original(payload);
    }
    resolve();
  })
})

Actions.replaceAction('HoldCall', (payload, original) => {
  return new Promise((resolve, reject) => {

    const task = payload.task;
    const reservation = payload.task.sourceObject;
    const conference = task.attributes.conference.sid;
    const participant = task.attributes.conference.participants.customer;
    const hold = true;

    if (task.taskChannelUniqueName === 'custom1' && reservation.task.attributes.direction === 'outbound') {
      toggleHold(conference, participant, hold, original, payload, reservation);
    } else {
      original(payload);
    }
    resolve();
  })
})

Actions.replaceAction('UnholdCall', (payload, original) => {
  return new Promise((resolve, reject) => {

    const task = payload.task;
    if (typeof(task.attributes.conference) === 'undefined') {
      original(payload)
    } else {

      const reservation = payload.task.sourceObject;
      const conference = task.attributes.conference.sid;
      const participant = task.attributes.conference.participants.customer;
      const hold = false;

      if (task.taskChannelUniqueName === 'custom1' && reservation.task.attributes.direction === 'outbound') {
        toggleHold(conference, participant, hold, original, payload, reservation);
      } else {
        original(payload);
      }
    }
    resolve();
  })
})

function toggleHold(conference, participant, hold, original, payload, reservation) {
  return fetch(`${payload.task.attributes.url}/hold-call`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: `conference=${conference}&participant=${participant}&hold=${hold}`
  })
  .then(response => {
    original(payload);
  })
  .catch(error => {
    console.log(error);
  });
}
