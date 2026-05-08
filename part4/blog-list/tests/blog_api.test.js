const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  const saltRounds = 10

  const username = helper.initialUsers.username
  const name = helper.initialUsers.name
  const passwordHash = await bcrypt.hash(helper.initialUsers.password, saltRounds)

  await User.deleteMany({})
  const user = new User({
    username,
    name,
    passwordHash
  })
  await user.save()

  const initialBlogs = helper.initialBlogs.map(item => ({
    ...item,
    user: user._id
  }))


  await Blog.deleteMany({})

  for (let i = 0; i < initialBlogs.length; i++) {
    const blog = new Blog({
      title: initialBlogs[i].title,
      author: initialBlogs[i].author,
      url: initialBlogs[i].url,
      likes: initialBlogs[i].likes || 0,
      user: initialBlogs[i].user
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
  }
  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  const listKey = Object.keys(response.body[0])

  assert(listKey.includes('id'))
})

test('a valid blog can be added ', async () => {
  const tokenResponse = await helper.loginUser()

  const newBlog = {
    title: 'Deep Dive into Node.js Event Loop',
    author: 'Charlie Nguyen',
    url: 'https://example.com/node-event-loop',
    likes: 23,
  }

  // console.log('tokenResponse', tokenResponse.text.token)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map((n) => n.title)

  // console.log('contents', contents)
  assert(contents.includes('Deep Dive into Node.js Event Loop'))
})

test('a missing likes in blog still can be added ', async () => {
  const tokenResponse = await helper.loginUser()

  const newBlog = {
    title: 'Deep Dive into Node.js Event Loop',
    author: 'Charlie Nguyen',
    url: 'https://example.com/node-event-loop',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.filter((n) => n.title === 'Deep Dive into Node.js Event Loop')[0]
  // console.log('contents', contents)
  // console.log('contents', ((contents['likes'] === 0) && (contents ? true : false)))

  assert(((contents['likes'] === 0) && (contents ? true : false)))
})

test('a missing title or url properties respond with 400 Bad Reqeuest ', async () => {
  const tokenResponse = await helper.loginUser()

  const newBlogOne = {
    author: 'Charlie Nguyen',
    url: 'https://example.com/node-event-loop',
    likes: 23
  }
  const newBlogTwo = {
    title: 'Deep Dive into Node.js Event Loop',
    author: 'Charlie Nguyen',
    likes: 23
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .send(newBlogOne)
    .expect(400)
    // .expect('Content-Type', /application\/json/)
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .send(newBlogTwo)
    .expect(400)
    // .expect('Content-Type', /application\/json/)
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const tokenResponse = await helper.loginUser()

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenResponse.body.token}`)
      .expect(204)


    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map((n) => n.title)
    assert(!contents.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

test.only('succeeds editing likes', async () => {
  const tokenResponse = await helper.loginUser()

  const blogsAtStart = await helper.blogsInDb()
  const blogsToEdit = blogsAtStart[1]

  const blog = await api
    .get(`/api/blogs/${blogsToEdit.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogBody = blog.body

  blogBody.likes = blogBody.likes + 20

  await api
    .put(`/api/blogs/${blogsToEdit.id}`)
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .send(blogBody)

  const getBlogAgain = await api
    .get(`/api/blogs/${blogsToEdit.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(getBlogAgain.body, blogBody)
})

test('fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Deep Dive into Node.js Event Loop',
    author: 'Charlie Nguyen',
    url: 'https://example.com/node-event-loop',
    likes: 23,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nara',
      name: 'Supernara',
      password: 'na'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('content password too short'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})