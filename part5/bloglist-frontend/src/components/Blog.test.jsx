import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

vi.mock('../services/blogs')

describe('<Blog />', () => {
  const userOne = {
    username: 'mchan',
    id:1
  }
  const blogByUserOne = {
    title: 'Component testing is done with react-testing-library',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: userOne
  }

  const userTwo = {
    username: 'nara',
    id:2
  }
  const mockHandler = vi.fn()

  beforeEach(() => {
    vi.mock('react-router-dom', () => ({
      useNavigate: () => vi.fn(),
      useParams: () => vi.fn(),
    }))
  })

  describe('When user is not authenticated', () => {
    beforeEach(() => {
      render(
        <Blog blog={blogByUserOne} updatedBlog={mockHandler} />
      )
    })

    test('blog information are visible while button are not', () => {
      const elementTitle = screen.getByText('Component testing is done with react-testing-library', { exact: false })
      const elementAuthor = screen.getByText('Michael Chan', { exact: false })
      const elementUrl = screen.getByText('https://reactpatterns.com/', { exact: false })
      const elementLikes = screen.getByText('7', { exact: false })

      expect(elementTitle).toBeVisible()
      expect(elementAuthor).toBeVisible()
      expect(elementUrl).toBeVisible()
      expect(elementLikes).toBeVisible()

      const buttonRemove = screen.queryByText('remove')
      const buttonLike = screen.queryByText('like')
      expect(buttonRemove).toBeNull()
      expect(buttonLike).toBeNull()
    })
  })



  describe('When creator is different', () => {
    beforeEach(() => {
      render(
        <Blog blog={blogByUserOne} updatedBlog={mockHandler} user={userTwo}/>
      )
    })

    test('only likes button that were shown', async () => {
      const buttonRemove = screen.queryByText('remove')
      const buttonLike = screen.queryByText('like')
      expect(buttonRemove).toBeNull()
      expect(buttonLike).toBeVisible()
    })
  })

  describe('When creator is same', () => {
    beforeEach(() => {
      render(
        <Blog blog={blogByUserOne} updatedBlog={mockHandler} user={userOne}/>
      )
    })

    test('both likes and delete button are shown', async () => {
      const buttonRemove = screen.queryByText('remove')
      const buttonLike = screen.queryByText('like')
      expect(buttonRemove).toBeVisible()
      expect(buttonLike).toBeVisible()
    })
  })
})