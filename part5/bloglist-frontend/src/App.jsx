import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import { Container, ThemeProvider, AppBar, Toolbar, Button,Typography, Box } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#00f9dc',
    },
  },
})

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [createMessage, setCreateMessage] = useState(null)

  const navigate = useNavigate()

  const sortBlogs = (blog) => {
    blog.sort(({ likes: a }, { likes: b }) => b - a)

    return blog
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      const sortedBlogs = sortBlogs(blogs)
      setBlogs(sortedBlogs)
      console.log('blog setelah inisialisasi', sortedBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event, username, password) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      console.log('user pertama klai login', user)
      setUser(user)
      navigate('/')
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.location.reload()
    navigate('/')
  }

  const handleCreate = async (blog) => {
    console.log('creating stuff')

    let newBlog = await blogService.create(blog)
    newBlog = {
      ...newBlog,
      user: { username: user.username, name: user.name, id: user.id }
    }

    const newBlogs = [
      ...blogs,
      newBlog
    ]
    setBlogs(newBlogs)

    setCreateMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    setTimeout(() => {
      setCreateMessage(null)
    }, 5000)
  }

  const handleUpdateBlog = (updatedBlog) => {
    const copyOld = [...blogs]

    const copyNew = copyOld.map(blog => (blog.id === updatedBlog.id) ? updatedBlog : blog)
    const sortedCopyNew = sortBlogs(copyNew)

    setBlogs(sortedCopyNew)
    console.log('hasil dari sort ', sortedCopyNew)
  }

  const handleUpdateBlogs = (id) => {
    const newBlogs = blogs.filter((blog) => blog.id !== id)
    setBlogs(newBlogs)
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(note => note.id === match.params.id)
    : null

  const hoverStyle = { }
  return (
    <ThemeProvider theme={theme} disableGutters>
      <Container style={{ width: 'full' }} maxWidth={false}disableGutters>
        <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Blogs
              </Typography>
              <Button color="inherit" component={Link} to="/" sx={hoverStyle}>blogs</Button>
              {!user && <Button color="inherit" component={Link} to="/login" sx={hoverStyle}>login</Button>}
              {user && (
                <>
                  <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>new blog</Button>
                  <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>Logout</Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>


        {errorMessage && <Notification message={errorMessage} type={'error'}/>}
        {createMessage && <Notification message={createMessage} type={'message'}/>}

        <Routes>
          <Route path="/login" element={
            <Login onLogin={handleLogin}/>
          } />
          <Route path="/create" element={
            <CreateNew handleCreate={handleCreate}/>
          } />
          <Route
            path="/"
            element={<BlogList
              blogs={blogs}
              updatedBlog={handleUpdateBlog}
              updatedBlogs={handleUpdateBlogs}
              user={user}
            />}
          />
          <Route path="/blogs/:id" element={
            <Blog
              blog={blog}
              updatedBlog={handleUpdateBlog}
              updatedBlogs={handleUpdateBlogs}
              user={user}
            />
          } />
        </Routes>


        {/* {!user && loginForm()}
          {user && (
            <div>
              {createMessage && <Notification message={createMessage} type={'message'}/>}
              <button onClick={handleLogout}>Logout</button>
              <p>{user.name} logged in</p>

              <Togglable buttonLabel="create new blog">
                <CreateNew
                  handleCreate={handleCreate}
                />
              </Togglable>
              {
                blogs.map(blog =>
                  <Blog key={blog.id} blog={blog} updatedBlog={handleUpdateBlog} updatedBlogs={handleUpdateBlogs} user={user}/>)}
            </div>
          )}  */}
      </Container>
    </ThemeProvider>
  )
}

export default App