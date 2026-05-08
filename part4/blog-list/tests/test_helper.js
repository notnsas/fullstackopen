const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Understanding Async JavaScript',
    author: 'Alice Johnson',
    url: 'https://example.com/async-js',
    likes: 18
  },
  {
    title: 'Mastering MongoDB Basics',
    author: 'Bob Smith',
    url: 'https://example.com/mongodb-basics',
    likes: 9
  }
]

const initialUsers = {
  username: 'root',
  name: 'Superuser',
  password: 'secret'
}

const loginUser = async () => {
  const username = initialUsers.username
  const password = initialUsers.password
  const tokenResponse = await api
    .post('/api/login')
    .send({ username, password })

  return tokenResponse
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  loginUser,
  nonExistingId,
  blogsInDb,
  usersInDb
}