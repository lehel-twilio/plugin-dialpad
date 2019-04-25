import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { css } from 'react-emotion';
import { withTaskContext } from '@twilio/flex-ui';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GroupAdd from '@material-ui/icons/GroupAdd';
import GridOn from '@material-ui/icons/GridOn';
import Forward from '@material-ui/icons/Forward';
import Backspace from '@material-ui/icons/Backspace';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  }
});

const iconButtons = css`
  display: contents !important;
`

const conferenceButton = css`
  margin: 20px;
`

const keypadButton = css`
  margin: 20px;
`

const forwardButton = css`
  margin: 20px;
`

const wrapper = css`
  height: 400px;
`

const dialpadKeypad = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const conferenceKeypad = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const numpadContainer = css`
  align-self: center;
`

const buttonRow = css`
  width: 100%;
  display: flex;
  color: #000000 !important;
`

const screen = css`
  width: 100%;
  height: 10%;
  color: #9E9E9E;
  font-weight: 100;
`

const screenWrapper = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 20px;
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
  width: 205px;
`

const backspaceButton = css``

function NoOptionsMessage(props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component='div'
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

export class ConferenceButton2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'none',
      screenMainLine: '',
      transferTo: ''
    }
  };

  componentDidMount() {
    document.addEventListener('keyup', this.eventListener, false);
    document.addEventListener('paste', this.pasteListener, false);

    //Populate a list of workers in TaskRouter to be used in the Search Box
    const query = '';
    this.props.insightsClient.instantQuery('tr-worker')
      .then((q: InstantQuery) => {
        this.workersSearch = q;
        q.on('searchResult', (items: any) => {
          this.setState({ workerList: items });
        });
        q.search(query);
      });
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.eventListener, false);
    document.removeEventListener('paste', this.pasteListener, false);
  }

  eventListener = (e) => this.keyPressListener(e);

  pasteListener = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,''); //strip all non numeric characters from paste
    this.setState({screenMainLine: (typeof this.state.screenMainLine === 'undefined' ? paste : this.state.screenMainLine + paste)});
  }

  handleSearchChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  numbers = [
    [ '1', '2', '3' ],
    [ '4', '5', '6' ],
    [ '7', '8', '9' ],
    [ '*', '0', '#' ]
  ];

  buttons = this.numbers.map((row, i) => {
    let originalThis = this;

    return (
      <div className={buttonRow} key={i}>
      {
        row.map(function(item, i) {
          return (<Button size='large' key={item} onClick={e => originalThis.buttonPress(item, originalThis.props.activeCall)}>{item}</Button>);
        })
      }
    </div>)
  })

  dialPad = () => {
    const { classes, theme } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    if (this.state.mode === 'dialpad') {
      return (
        <div className={dialpadKeypad}>
          <div className={numpadContainer}>
            {this.buttons.map((button) => (button))}
          </div>
        </div>
      )
    } else if (this.state.mode === 'conference') {
      //Populate suggestions list
      let suggestions = [];
      for (let i in this.state.workerList) {
        suggestions.push({
          label: this.state.workerList[i].attributes.full_name,
          value: this.state.workerList[i].attributes.contact_uri
        });
      };

      return (
        <div className={conferenceKeypad}>
          <this.screen/>
          <NoSsr>
            <Select
              classes={classes}
              styles={selectStyles}
              options={suggestions}
              components={components}
              value={this.state.single}
              onChange={this.handleSearchChange('transferTo')}
              placeholder='Search'
              isClearable
            />
          </NoSsr>
          <div className={numpadContainer}>
            {this.buttons.map((button) => (button))}
            <this.plusButton/>
          </div>
          <IconButton color='inherit' className={iconButtons} component='div'>
            <Forward className={forwardButton} onClick={e => this.addConferenceParticipant()}/>
          </IconButton>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }

  screen = () => {
    if (this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (<div className={screen}>
        <div className={screenWrapper}>
          <p className={plus}>{this.state.plus}</p>
          <p className={screenMainLine}>{this.state.screenMainLine}</p>
          <Backspace className={backspaceButton} onClick={e => this.backspace()}/>
        </div>
      </div>)
    }
  }

  plusButton = () => {
    if (this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (<div>
        <Button size='large' key='placeHolder' > </Button>
        <Button size='large' key='+' onClick={e => this.buttonPress('+', this.props.activeCall)}>+</Button>
        <Button size='large' key='placeHolder2' > </Button>
      </div>)
    }
  }

  keyPressListener(e) {
    if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 187) { //listen to 0-9 & +
      this.buttonPress(e.key, this.props.activeCall);
    } else if (e.keyCode === 8) { //listen for backspace
      this.backspace();
    } else if (e.keyCode === 13) { //listen for enter
      this.addConferenceParticipant();
      this.setState({screenMainLine: ''});
    }
  }

  backspace() {
    this.setState({screenMainLine: this.state.screenMainLine.substring(0, this.state.screenMainLine.length - 1)});
  }

  buttonPress(key, activeCall) {
    //Only send DTMF in dialpad mode
    if (this.state.mode === 'dialpad') {
      activeCall[0].source.sendDigits(key);
    } else {
      if (key === '+') {
        this.setState({plus: this.state.plus === '+' ? '' : '+'});
      } else {
        this.setState({screenMainLine: (typeof this.state.screenMainLine === 'undefined' ? key : this.state.screenMainLine + key)});
      }
    }
  }

  addConferenceParticipant() {
    //If Worker is selected, add worker to conference, otherwise add number from screenMainLine
    const to = typeof(this.state.transferTo) === 'object' ? this.state.transferTo.value : this.state.screenMainLine;
    const from = typeof(this.state.transferTo) === 'object' ? this.props.workerName : this.props.from;

    fetch(`https://${this.props.url}/add-conference-participant`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `taskSid=${this.props.task.taskSid}&from=${from}&to=${to}`
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
  }

  displayDialpad() {
    this.setState({ mode: this.state.mode === 'dialpad' ? 'none' : 'dialpad' });
  }

  displayConferenceKeypad() {
    this.setState({ mode: this.state.mode === 'conference' ? 'none' : 'conference' });
  }

  render() {
    return (
      <div className={wrapper}>
        <IconButton color='inherit' className={iconButtons} component='div'>
          <GroupAdd className={conferenceButton} onClick={e => this.displayConferenceKeypad()}/>
          <GridOn className={keypadButton} onClick={e => this.displayDialpad()}/>
        </IconButton>
        <this.dialPad/>
      </div>
    )
  }
};

ConferenceButton2.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const ConferenceButton = withTaskContext(ConferenceButton2);

const mapStateToProps = state => {
  return {
    from: state.flex.worker.attributes.phone,
    activeCall: state.flex.phone.connections,
    workerName: state.flex.worker.attributes.full_name,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ConferenceButton));
