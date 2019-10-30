export const addConferenceParticipant = (number, props) => {
  //If Worker is selected, add worker to conference, otherwise add number from screenMainLine
  number = props.directoryWorker === '' ? number : props.directoryWorker;
  const from = props.directoryWorker === '' ? props.from : props.workerName;
  const jweToken = props.manager.store.getState().flex.session.ssoTokenPayload.token

  fetch(`https://${props.runtimeDomain}/add-conference-participant`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: `taskSid=${props.task.taskSid}&from=${from}&to=${number}&Token=${jweToken}`
  })
  .then(response => response.json())
  .then(json => {
    console.log(json);
  })
};
