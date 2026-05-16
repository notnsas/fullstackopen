import TogglableBlog from './TogglableBlog'
import blogService from '../services/blogs'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Typography, Button } from '@mui/material'

const Blog = ({ blog, updatedBlog, updatedBlogs, user }) => {
  console.log('blog di blog', blog)
  console.log('user di blog', user)
  // const [blog, setblog] = useState(blog)

  const id = useParams().id
  const navigate = useNavigate()

  if(!blog) {
    return null
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    if (user) {
      const newLikes = blog.likes + 1
      const newBlog = {
        ...blog,
        likes: newLikes
      }

      blogService.update(id, newBlog)
      updatedBlog(newBlog)
    }
  }

  const handleDelete = async () => {
    const isDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)

    if (isDelete) {
      try {
        await blogService.deleteBlog(id)
      } catch {
        console.log('error')
        return
      }
      updatedBlogs(id)
      navigate('/')
    }
  }

  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`
    }
    return url
  }

  return (
    <div>
      <Card sx={{ padding: 2 , width: '50%', margin: 'auto', marginTop: 5 }}>
        <Typography variant="h4" component="h2">
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" component="h1">
          by {blog.author}
        </Typography>
        <Typography variant="subtitle1" component="h2">
          <a href={formatUrl(blog.url)} target={'_blank'} rel="noopener noreferrer external">
            {blog.url}
          </a>
        </Typography>
        <div>Added by {blog.user.username}</div>
        {(typeof user?.id !== 'undefined' && typeof blog?.user?.id !== 'undefined' && user?.id === blog.user.id) && <button onClick={handleDelete}>remove</button>}
        <div style={{ display: 'flex' }}>
          <div style={{ flexGrow: 1 }}></div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Typography sx={{ marginBottom: '4px'}}>{blog.likes} Likes</Typography>
            {user &&<Button
              onClick={() => {
                handleLike()
              }}
              variant="contained"
              color="secondary"
            >
              like
            </Button>
            }
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Blog