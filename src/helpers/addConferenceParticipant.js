export const addConferenceParticipant = (number, props) => {
  //If Worker is selected, add worker to conference, otherwise add number from screenMainLine
  number = props.directoryWorker === '' ? number : props.directoryWorker;
  const from = props.directoryWorker === '' ? props.from : props.workerName;

  fetch(`https://${props.runtimeDomain}/add-conference-participant`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: `taskSid=${props.task.taskSid}&from=${from}&to=${number}&Token=${props.jweToken}`
  })
  .then(response => response.json())
  .then(json => {
    console.log(json);
  })
};
