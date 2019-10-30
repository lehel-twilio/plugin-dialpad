import React from 'react';
import { connect } from 'react-redux';
import { buttonPressAction } from '../actions/DialpadActions';

import Button from '@material-ui/core/Button';

class Buttons extends React.Component {

  numbers = [
    [ '1', '2', '3' ],
    [ '4', '5', '6' ],
    [ '7', '8', '9' ],
    [ '*', '0', '#' ]
  ];

  buttonPress(key) {
    this.props.buttonPress(key);
  }

  render() {
    return this.numbers.map((row, i) => {

      let originalThis = this;

      return (
        <div key={i}>
        {
          row.map((item, i) => {
            return (<Button size='large' key={item} onClick={e => originalThis.buttonPress(item)}>{item}</Button>);
          })
        }
      </div>)
    })
  }
}

const mapStateToProps = (state) => {
  return {
    activeCall: state.flex.phone.connections,
    plus: state.dialpad.plus,
    screenMainLine: state.dialpad.screenMainLine
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  buttonPress: (key) => dispatch(buttonPressAction(key))
})

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
