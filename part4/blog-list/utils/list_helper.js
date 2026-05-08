const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = array => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

const favoriteBlog = array => {
  const reducer = (best, current) => {
    return (current.likes >= best.likes) ? current : best
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer)
}

const mostBlogs = (blogs) => {
  const blogResult = _(blogs)
    .groupBy('author')
    .map((items, author) => ({
      author,
      blogs: items.length
    }))
    .maxBy('blogs')

  return blogResult ? blogResult : 0
}

const mostLikes = (blogs) => {
  const likesResult = _(blogs)
    .groupBy('author')
    .map((items, author) => ({
      author,
      likes: _.sumBy(items, 'likes')
    }))
    .maxBy('likes')

  return likesResult ? likesResult : 0
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}