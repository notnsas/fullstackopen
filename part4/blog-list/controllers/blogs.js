const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

logger.info('blogRouter is starting..')
blogRouter.get('/', (request, response) => {
  logger.info('Getting all blogs...')
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter