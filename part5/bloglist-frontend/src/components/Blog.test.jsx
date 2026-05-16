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


  // test('url and likes were shown when clicking button', async () => {
  //   const user = userEvent.setup()

  //   const elementUrl = screen.getByText('https://reactpatterns.com/', { exact: false })
  //   const elementLikes = screen.getByText('7', { exact: false })

  //   const viewButton = screen.getByText('view')
  //   await user.click(viewButton)

  //   expect(elementUrl).toBeVisible()
  //   expect(elementLikes).toBeVisible()
  // })

  // test('if the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
  //   // const mockHandler = vi.fn()
  //   const user = userEvent.setup()

  //   const viewButton = screen.getByText('view')
  //   await user.click(viewButton)

  //   const likeButton = screen.getByText('like')
  //   await user.click(likeButton)
  //   await user.click(likeButton)

  //   expect(mockHandler.mock.calls).toHaveLength(2)
  // })
})