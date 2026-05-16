import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return <Alert sx={{ marginY: 2 }} severity={type === 'error' ? 'error' : 'success'}>{message}</Alert>
}

export default Notification