import { render, screen } from '@testing-library/react'
import CreateNew from './CreateNew'
import userEvent from '@testing-library/user-event'

test('<CreateNew /> updates parent state and calls onSubmit', async () => {
  beforeEach(() => {
    vi.mock('react-router-dom', () => ({
      useNavigate: () => vi.fn(),
      useParams: () => vi.fn(),
    }))
  })

  const user = userEvent.setup()
  const handleCreate = vi.fn()

  render(<CreateNew handleCreate={handleCreate} setTitle={vi.fn()} setAuthor={vi.fn()} setUrl={vi.fn()}/>)


  const inputTitle = screen.getByLabelText('title:')
  await user.type(inputTitle, 'What is life')

  const inputAuthor = screen.getByLabelText('author:')
  await user.type(inputAuthor, 'Jamal')

  const inputUrl = screen.getByLabelText('url:')
  await user.type(inputUrl, 'hamumu.com')

  const submitButton = screen.getByText('create')
  await user.click(submitButton)


  expect(handleCreate.mock.calls).toHaveLength(1)

  expect(handleCreate.mock.calls[0][0].title).toBe('What is life')
  expect(handleCreate.mock.calls[0][0].author).toBe('Jamal')
  expect(handleCreate.mock.calls[0][0].url).toBe('hamumu.com')
})