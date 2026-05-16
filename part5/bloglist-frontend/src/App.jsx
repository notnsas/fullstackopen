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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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

    setCreateMessage(`a new blog ${title} by ${author} added`)
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

  return (
    <div>
      <div>
        <Link style={padding} to="/"></Link>
        <Link style={padding} to="/">blogs</Link>
        {!user && <Link style={padding} to="/login">login</Link>}
        {user && (
          <>
            <Link style={padding} to="/create">new blog</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {errorMessage && <Notification message={errorMessage} type={'error'}/>}

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
    </div>
  )
}

export default App