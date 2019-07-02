import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { connect } from 'react-redux';

import sharedTheme from '../styling/theme.js';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

import { selectDirectoryWorker } from '../actions/DialpadActions';

const styles = theme => (sharedTheme(theme));

const directory = css`
  align-self: center;
`

class Directory extends React.Component {

  handleChange = event => {
    this.props.selectDirectoryWorker(event.target.value);
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={directory} autoComplete='off'>
        <FormControl className={classes.formControl}>
          <Select
            value={this.props.directoryWorker}
            onChange={this.handleChange}
            isClearable
          >
            {Object.keys(this.props.workerList).map((worker)=> (
              <MenuItem value={this.props.workerList[worker].attributes.contact_uri} key={this.props.workerList[worker].attributes.contact_uri}>
                {this.props.workerList[worker].attributes.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    )
  }
}

Directory.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    directoryWorker: state.dialpad.directoryWorker,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectDirectoryWorker: (value) => dispatch(selectDirectoryWorker(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Directory));
