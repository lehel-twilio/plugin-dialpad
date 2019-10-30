import { Actions } from '@twilio/flex-ui';

export const dial = (number, props) => {

  if (number !== ''){
    //no leading plus is present
    if (!number.substring(0,1) === '+') {
      //if 10 digits, assume US number and add +1
      if (number.length === 10) {
        number = `+1${number}`;
      } else {
        //otherwise just add a leading plus
        number = `+${number}`;
      }
    }
  }

  //If Worker is selected, add worker to conference, otherwise add number from screenMainLine
  number = props.directoryWorker === '' ? number : props.directoryWorker;
  let from = props.directoryWorker === '' ? props.from : props.workerName;
  const internal = props.directoryWorker !== '';

  if (number.length > 0) {

    //preserve the leading plus sign
    from = encodeURIComponent(from);
    number = encodeURIComponent(number);
    const workerContactUri = encodeURIComponent(props.workerContactUri);

    const jweToken = props.manager.store.getState().flex.session.ssoTokenPayload.token

    fetch(`https://${props.runtimeDomain}/create-new-task`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `From=${from}&To=${number}&Worker=${workerContactUri}&Internal=${internal}&Token=${jweToken}`
    })
    .then(response => response.json())
    .then(json => {
      Actions.invokeAction('NavigateToView', { viewName: 'agent-desktop' });
    })
  } else {
    console.log('Invalid number dialed');
  }
};
