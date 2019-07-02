export const buttonPressAction = (key) => ({
  type: 'PHONE_BUTTON_PUSHED',
  key
})

export const backspaceAction = () => ({
  type: 'BACKSPACE'
})

export const setScreenMainLine = (value) => ({
  type: 'SET_SCREEN_MAINLINE',
  value
})

export const selectDirectoryWorker = (value) => ({
  type: 'SELECT_DIRECTORY_WORKER',
  value
})
