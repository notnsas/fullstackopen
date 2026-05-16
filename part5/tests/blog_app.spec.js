const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, viewBlog, likeBlog } = require('./helper')
const { log } = require('node:console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    page.on('dialog', dialog => dialog.accept())

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()

    await expect(page.getByText('username')).toBeVisible()
    await page.getByLabel('username')

    await expect(page.getByText('password')).toBeVisible()
    await page.getByLabel('password') 

    await expect(page.getByText('login').locator('..').getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      const newBlog = {
        author: 'm.k',
        title: 'a note created by playwright',
        url: 'blog.com'
      }
      await createBlog(page, newBlog)

      await expect(page.getByText(newBlog.title)).toBeVisible()
      await expect(page.getByText(newBlog.author)).toBeVisible()
    })

    describe('and several blog exists', () => {
      beforeEach(async ({ page }) => {
        const firstBlog = {
          author: 'Michael Chan',
          title: 'First blog',
          url: 'firstblog.com'
        }

        const secondBlog = {
          author: 'Dan Abramov',
          title: 'Second blog',
          url: 'secondblog.com'
        }

        const thirdBlog = {
          author: 'Kent Dodds',
          title: 'Third blog',
          url: 'thirdblog.com'
        }

        await createBlog(page, firstBlog)
        await createBlog(page, secondBlog)
        await createBlog(page, thirdBlog)
      })

      test('one of those can be liked', async ({ page }) => {
        await page.pause()

        const otherBlogElement = await viewBlog(page, 'Second blog')
        await otherBlogElement
          .getByRole('button', { name: 'like' })
          .click()

        await expect(otherBlogElement.getByText('likes 1')).toBeVisible()
      })

      test('one of those can be deleted', async ({ page }) => {
        await page.pause()
        
        const otherBlogElement = await viewBlog(page, 'Second blog')
        await otherBlogElement
          .getByRole('button', { name: 'remove' })
          .click()

        await expect(page.getByText('Second blog')).not.toBeVisible()
      })

      test('remove cant be seen if the maker isnt the user', async ({ page, request }) => {
        page.on('console', msg => {
          console.log('BROWSER LOG:', msg.text())
        })
        console.log('tsest debug')
        const newObject = {
          title: 'Playwright notnsa blog',
          author: 'notnsa',
          url: 'https://blog.com'
        }

        await request.post('/api/users', {
          data: {
            name: 'nara',
            username: 'notnsa',
            password: 'narapassword'
          }
        })

        const loginResponse = await request.post('/api/login', {
          data: {
            username: 'notnsa',
            password: 'narapassword'
          }
        })

        const loginData = await loginResponse.json()

        console.log('user debug in test', loginData)

        const token = `Bearer ${loginData.token}`

        const response = await request.post('/api/blogs', {
          data: newObject,
          headers: {
            Authorization: token
          }
        })

        console.log(await response.json())

        await page.reload()
        
        // await page.pause()
        
        const otherBlogElement = await viewBlog(page, 'Playwright notnsa blog')

        await expect(otherBlogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('the blog is sorted according highest likes', async ({ page }) => {
        await page.pause()

        await likeBlog(page, 'First blog', 13)
        await likeBlog(page, 'Second blog', 12)
        await likeBlog(page, 'Third blog', 15)

        const firstBlog = await page.getByRole('button', { name: 'hide' }).nth(0).locator('..')
        const secondBlog = await page.getByRole('button', { name: 'hide' }).nth(1).locator('..')
        const thirdBlog = await page.getByRole('button', { name: 'hide' }).nth(2).locator('..')
        console.log('testBlog', await firstBlog.innerHTML())
        
        await expect(firstBlog.getByText('Third blog')).toBeVisible()
        await expect(secondBlog.getByText('First blog')).toBeVisible()
        await expect(thirdBlog.getByText('Second blog')).toBeVisible()
      })
    })
  })
})