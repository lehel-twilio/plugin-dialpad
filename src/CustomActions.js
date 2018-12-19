import { Actions } from "@twilio/flex-ui";

Actions.replaceAction("AcceptTask", (payload, original) => {
  return new Promise((resolve, reject) => {
    const reservation = payload.task.sourceObject;

    if (payload.task.taskChannelUniqueName === "custom1" && payload.task.attributes.direction === "outbound") {

      reservation.call(reservation.task.attributes.from,
        `${payload.task.attributes.url}/agent-outbound-join?taskSid=${payload.task.taskSid}`, {
          accept: true
        }
      )

    } else {
      original(payload)
    }
    resolve();
  })
})

Actions.replaceAction("HoldCall", (payload, original) => {
  return new Promise((resolve, reject) => {

    const task = payload.task;
    const reservation = payload.task.sourceObject;
    const conference = task.attributes.conference.sid;
    const participant = task.attributes.conference.participants.customer;
    const hold = true;

    if (task.taskChannelUniqueName === "voice" && reservation.task.attributes.direction === "outbound") {
      toggleHold(conference, participant, hold, original, payload, reservation);
    } else {
      original(payload);
    }
    resolve();
  })
})

Actions.replaceAction("UnholdCall", (payload, original) => {
  return new Promise((resolve, reject) => {

    const task = payload.task;
    if (Number(task.age) <= 2) {
      original(payload)
    } else {
      const reservation = payload.task.sourceObject;
      const conference = task.attributes.conference.sid;
      const participant = task.attributes.conference.participants.customer;
      const hold = false;

      if (task.taskChannelUniqueName === "voice" && reservation.task.attributes.direction === "outbound") {
        toggleHold(conference, participant, hold, original, payload, reservation);
      } else {
        original(payload);
      }
    }
    resolve();
  })
})

Actions.replaceAction("HangupCall", (payload, original) => {
  return new Promise((resolve, reject) => {

    const task = payload.task;

    original(payload);
    task.wrapUp();
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
