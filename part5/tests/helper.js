const loginWith = async (page, username, password) => {
  await page.getByText('login').click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, {author, title, url}) => {
  await page.getByText('new blog').click()

  await page.getByText('author').getByRole('textbox').fill(author)
  await page.getByText('title').getByRole('textbox').fill(title)
  await page.getByText('url').getByRole('textbox').fill(url)

  await page.getByRole('button', { name: 'create' }).click()
  // await page.getByRole('button', { name: 'cancel' }).click()

  await page.getByText(title).waitFor()
}

const viewBlog = async (page, title) => {
  const blogElement = page.getByText(title)

  await blogElement
    .click()

  return blogElement
}

const likeBlog = async (page, title, numOfLikes) => {
  const blogElement = await viewBlog(page, title)
  const buttonLike = await blogElement
    .getByRole('button', { name: 'like' })

  for (let i = 0; i < numOfLikes; i++) {
    await buttonLike.click()
  }

  // await blogElement.getByRole

  return blogElement
}
  

export { loginWith, createBlog, viewBlog, likeBlog }