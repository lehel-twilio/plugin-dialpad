import React from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { buttonPressAction } from '../actions/DialpadActions';

import sharedTheme from '../styling/theme.js';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => (sharedTheme(theme));

const buttonRow = css`
  width: 100%;
  display: flex;
  color: #000000 !important;
`

class Buttons extends React.Component {

  numbers = [
    [ '1', '2', '3' ],
    [ '4', '5', '6' ],
    [ '7', '8', '9' ],
    [ '*', '0', '#' ]
  ];

  buttonPress(key) {

    if (this.props.activeCall.length > 0 && this.props.mode === 'dtmf') {
      this.props.activeCall[0].source.sendDigits(key);
    } else {
      this.props.buttonPress(key);
    }
  }

  render() {
    return this.numbers.map((row, i) => {

      let originalThis = this;
      const { classes } = this.props;

      return (
        <div className={buttonRow} key={i}>
        {
          row.map((item, i) => {
            return (<Button size='large' className={classes.button} key={item} onClick={e => originalThis.buttonPress(item)}>{item}</Button>);
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Buttons));
