import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, updatedBlog, updatedBlogs, user }) => {
  console.log('blog di bloglist', blogs)
  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs.map(blog => (
          <div key={blog.id}>
            <li><Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link></li>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default BlogList