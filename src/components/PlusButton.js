import React from 'react';
import { connect } from 'react-redux';
import { buttonPressAction } from '../actions/DialpadActions';

import sharedTheme from '../styling/theme.js';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => (sharedTheme(theme));

class PlusButton extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button size='large' key='placeHolder' className={classes.button} > </Button>
        <Button size='large' key='+' className={classes.button} onClick={e => this.props.buttonPress('+')}>+</Button>
        <Button size='large' key='placeHolder2' className={classes.button} > </Button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  buttonPress: (key) => dispatch(buttonPressAction(key))
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(PlusButton));
