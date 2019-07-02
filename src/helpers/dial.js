import { Actions } from '@twilio/flex-ui';

export const dial = (number, props) => {
  //If Worker is selected, add worker to conference, otherwise add number from screenMainLine
  number = props.directoryWorker === '' ? number : props.directoryWorker;
  const from = props.directoryWorker === '' ? props.from : props.workerName;
  const internal = props.directoryWorker !== '';

  if (number.length > 0) {

    fetch(`https://${props.runtimeDomain}/create-new-task`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `From=${from}&To=${number}&Worker=${props.workerContactUri}&Internal=${internal}&Token=${props.jweToken}`
    })
    .then(response => response.json())
    .then(json => {
      Actions.invokeAction('NavigateToView', { viewName: 'agent-desktop' });
    })
  } else {
    console.log('Invalid number dialed');
  }
};
