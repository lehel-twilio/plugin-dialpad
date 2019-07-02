const sharedTheme = (theme) => ({
  root: {
    flexGrow: 1,
    height: 50,
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: '10px'
  },
  functionButton: {
    margin: '10px',
    padding: '0px'
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '300px'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  backspace: {
    paddingTop: '5px',
    margin: '0px'
  }
})

export default sharedTheme
