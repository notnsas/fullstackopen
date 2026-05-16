import { useState } from 'react'
import { TextField, Button, Card  } from '@mui/material'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card
        variant="outlined"
        sx={{
          paddingX: '100px',
          paddingY: '50px',
          width: 'fit',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
          borderRadius: '20px'
        }}
      >
        <h2>log in to application</h2>

        <form
          onSubmit={(event) =>
            onLogin(event, username, password)
          }
          style={{
            padding: 4,
            // width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 10
          }}
        >
          <div>
            <TextField
              label="username"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </div>

          <div>
            <TextField
              type="password"
              label="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

          </div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
          {/* <button type="submit">login</button> */}
        </form>
      </Card>
    </div>
  )
}

export default Login