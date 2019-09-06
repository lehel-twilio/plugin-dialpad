const dialpadReducer = (state = { screenMainLine: '', activeCall: '', directoryWorker: ''}, action) => {
  switch (action.type) {
    case 'PHONE_BUTTON_PUSHED':
      if (action.key === '+') {
        return Object.assign({}, state, {
          plus: state.plus === '+' ? '' : '+'
        });
      } else {
        return Object.assign({}, state, {
          screenMainLine: (typeof state.screenMainLine === 'undefined' ? action.key : state.screenMainLine + action.key)
        });
      }

    case 'BACKSPACE':
      return Object.assign({}, state, {
        screenMainLine: state.screenMainLine.substring(0, state.screenMainLine.length - 1),
      });

    case 'SET_SCREEN_MAINLINE':
      if (action.value === '') {
        return Object.assign({}, state, {
          plus: '',
          screenMainLine: ''
        });
      } else {
        return Object.assign({}, state, {
          screenMainLine: action.value
        });
      }

    case 'SELECT_DIRECTORY_WORKER':
      return Object.assign({}, state, {
        directoryWorker: action.value
      });

    /* falls through */
    default:
      return state
  }
}

export default dialpadReducer
