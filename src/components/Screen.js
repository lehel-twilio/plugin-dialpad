import React from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { backspaceAction } from '../actions/DialpadActions';

import sharedTheme from '../styling/theme.js';
import Backspace from '@material-ui/icons/Backspace';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => (sharedTheme(theme));

const screen = css`
  width: 100%;
  height: 10%;
  color: #9E9E9E;
  font-weight: 100;
  padding-top: 10px;
  align-self: center;
`

const screenWrapper = css`
  height: 100%;
  align-self: center;
  justify-content: flex-start;
  padding-left: 10px;
  display: flex;
  flex-direction: row;
`

const plus = css`
  overflow: hidden;
  width: 15px;
  text-overflow: ellipsis;
  direction: rtl;
  font-size: 26px !important;
`

const screenMainLine = css`
  ${plus};
  width: 85%;
`

class Screen extends React.Component {

  render() {

    const { classes } = this.props;

    return (
      <div className={screen}>
        <div className={screenWrapper}>
          <p className={plus}>{this.props.plus}</p>
          <p className={screenMainLine}>{this.props.screenMainLine}</p>
          <Backspace className={classes.backspace} onClick={e => this.props.backspace()}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    plus: state.dialpad.plus,
    screenMainLine: state.dialpad.screenMainLine
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  backspace: () => dispatch(backspaceAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Screen));
