import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
import { css } from 'react-emotion';

import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Phone from '@material-ui/icons/Phone';
import CallEnd from '@material-ui/icons/CallEnd';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
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

const dialerContainer = css`
  height: 400px;
  background-color: #FFFFFF;
`

const agentDesktop = css`
  display: flex;
  flex-direction: column;
  height: 400px;
`

const numpadContainer = css`
  align-self: center;
`

const screen = css`
  width: 100%;
  height: 10%;
  background-color: white;
  color: #9E9E9E;
  font-weight: 100;
`

const buttonRow = css`
  width: 100%;
  display: flex;
  color: #000000 !important;
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

const screenWrapper = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 20px;
`

const iconButtons = css`
  display: contents !important;
`

const functionButtons = css`
  margin: 20px;
`

const volumeButton = css`
  margin: 20px;
`

const hangupButton = css`
  margin: 20px;
`

const dialButton = css``

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

export class DialPad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      screenMainLine: ''
    }
  };

  componentDidMount() {
    if (typeof this.props.content === 'undefined') { //Only listen on the Dialer page
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
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.eventListener, false);
    document.removeEventListener('paste', this.pasteListener, false);
    console.log('Removing event listener');
  }

  eventListener = (e) => this.keyPressListener(e);

  pasteListener = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,''); //strip all non numeric characters from paste
    this.setState({screenMainLine: (typeof this.state.screenMainLine === 'undefined' ? paste : this.state.screenMainLine + paste)});
  }

  keyPressListener(e) {
    if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 187) { //listen to 0-9 & +
      this.buttonPress(e.key, this.props.activeCall);
    } else if (e.keyCode === 8) { //listen for backspace
      this.backspace();
    } else if (e.keyCode === 13) { //listen for enter
      const number = (typeof this.state.plus === 'undefined') ? this.state.screenMainLine : `+${this.state.screenMainLine}`;
      this.setState({screenMainLine: ''});
      if (number !== '') {
        this.dial(number, this.props.url, this.props.from, this.props.workerContactUri);
      };
    }
  }

  buttonPress(key, activeCall) {
    if (activeCall !== '') {
      activeCall[0].source.sendDigits(key);
    }

    if (key === '+') {
      this.setState({plus: this.state.plus === '+' ? '' : '+'});
    } else {
      this.setState({screenMainLine: (typeof this.state.screenMainLine === 'undefined' ? key : this.state.screenMainLine + key)});
    }
  }

  backspace() {
    this.setState({screenMainLine: this.state.screenMainLine.substring(0, this.state.screenMainLine.length - 1)});
  }

  dial(number, url, from, workerContactUri) {

    //If Worker is selected, add worker to conference, otherwise add number from screenMainLine
    number = typeof(this.state.transferTo) === 'object' ? this.state.transferTo.value : number;
    from = typeof(this.state.transferTo) === 'object' ? this.props.workerName : from;
    const internal = typeof(this.state.transferTo) === 'object';

    if (number.length > 0) {

      fetch(`${url}/create-new-task`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: `From=${from}&To=${number}&Worker=${workerContactUri}&Internal=${internal}`
      })
      .then(response => response.json())
      .then(json => {
        Actions.invokeAction('NavigateToView', {viewName: 'agent-desktop'});
      })
    } else {
      console.log('Invalid number dialed');
    }
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

  functionButtons = () => {
    if (this.props.activeView === 'agentdesktop') {
      return (<div/>)
    } else if (this.props.activeCall !== '') {
      if (this.props.isMuted) {
        return (<div>
          <VolumeMute className={volumeButton} onClick={e => Actions.invokeAction('ToggleMute')}/>
          <CallEnd className={hangupButton} onClick={e => Actions.invokeAction('HangupCall')}/>
        </div>);
      } else {
        return (<div>
          <VolumeUp className={volumeButton} onClick={e => Actions.invokeAction('ToggleMute')}/>
          <CallEnd className={hangupButton} onClick={e => Actions.invokeAction('HangupCall')}/>
        </div>);
      }
    } else {
      return (<div>
        <Phone className={dialButton} onClick={e => {
          const number = (typeof this.state.plus === 'undefined') ? this.state.screenMainLine : `+${this.state.screenMainLine}`;
          this.setState({screenMainLine: ''});
          this.dial(number, this.props.url, this.props.from, this.props.workerContactUri);
        }} />
      </div>);
    }
  }

  screen = () => {
    if (this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      return (
        <div className={screen}>
          <div className={screenWrapper}>
            <p className={plus}>{this.state.plus}</p>
            <p className={screenMainLine}>{this.state.screenMainLine}</p>
            <Backspace className={backspaceButton} onClick={e => this.backspace()}/>
          </div>
        </div>
      )
    }
  }

  directory = () => {
    if (this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') { //Do not render the screen display if displaying on the main screen
      return <div/>;
    } else {
      const { classes } = this.props;

      const selectStyles = {
        input: base => ({
          ...base,
          color: '#222222',
          '& input': {
            font: 'inherit',
          },
        }),
      };

      let suggestions = [];
      for (let i in this.state.workerList) {
        suggestions.push({
          label: this.state.workerList[i].attributes.full_name,
          value: this.state.workerList[i].attributes.contact_uri
        });
      };

      return (
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
      )
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

  render() {
    return (
      <div>
        <div className={(this.props.activeView === 'agent-desktop' || this.props.activeView === 'agentdesktop') ? agentDesktop : dialerContainer} >
        <this.screen />
        <this.directory />
        <div className={numpadContainer}>
          {this.buttons.map((button) => (button))}
          <this.plusButton/>
        </div>
        <div className={functionButtons}>
          <IconButton color='inherit' className={iconButtons} component='div'>
            <this.functionButtons/>
          </IconButton>
        </div>
      </div>
    </div>
  )}
}

const getUrl = (serviceBaseUrl) => {
  let url = serviceBaseUrl;

  if(url.slice(0,5) !== 'https') {
    url = "https://" + url;
  }

  return url.slice(-1) === '/'
    ? url.substring(0, url.length - 1)
    : url;
}

DialPad.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    url: getUrl(state.flex.config.serviceBaseUrl),
    from: state.flex.worker.attributes.phone,
    workerContactUri: state.flex.worker.attributes.contact_uri,
    activeCall: typeof(state.flex.phone.connection) === 'undefined' ? '' : state.flex.phone.connection.source,
    isMuted: typeof(state.flex.phone.connection) === 'undefined' ? false : state.flex.phone.connection.source.mediaStream.isMuted,
    activeView: state.flex.view.activeView,
    workerName: state.flex.worker.attributes.full_name,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(DialPad));
