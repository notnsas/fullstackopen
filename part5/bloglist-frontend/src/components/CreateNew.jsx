import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Card  } from '@mui/material'

const CreateNew = ({
  handleCreate,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

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
        <h2>create new</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreate({ title, author, url })
            navigate('/')
          }}
          style={{
            padding: 4,
            // width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 14
          }}
        >
          <div>
            <TextField
              label="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </div>
          <div>
            <TextField
              label="author"
              value={author}
              onChange={event => setAuthor(event.target.value)}
            />
          </div>
          <div>
            <TextField
              label="url"
              value={url}
              onChange={event => setUrl(event.target.value)}
            />
          </div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
        </form>
      </Card>
    </div>
  )
}

export default CreateNew