const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')

logger.info('blogsRouter is starting..')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

  // console.log(blogs)

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user

  // console.log('user', user)

  if ((body.title) && (body.url)) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    console.log('blog is abt to be saved')

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    console.log('blog is saved')

    response.status(201).json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  // console.log('user', user)
  console.log('start findid')
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

  console.log('blog.user._id', blog.user._id)
  if ( blog.user._id.toString() === user._id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(403).json({ error: 'UserId is not authorized' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('Start putting')

  const user = request.user
  console.log('user', user)
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  console.log('user', user)

  if (typeof user === 'undefined') {
    return response.status(400).json({ error: 'User is not defined' })
  }

  if ((title === blog.title && author === blog.author && url === blog.url && likes !== blog.likes) || (blog.user._id.toString() === user._id.toString())) {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    await blog.save()
    response.json(blog)

  } else {
    return response.status(403).json({ error: 'UserId is not authorized' })
  }
})

module.exports = blogsRouter