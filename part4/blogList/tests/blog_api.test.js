const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')

beforeEach(async ()  => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog =>blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const passwordHash1 = await bcrypt.hash('secret', 10)
    const user1 = new User({ username: 'root1', passwordHash1 })
    await user1.save()
})

describe('when there is initially some blogs saved', () => {
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blog has the "id" properties', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        expect(blog.id).toBeDefined()
    })
})

describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
        const userlogin = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })
            .expect(200)

        const newBlog = {
            title: 'blog add test',
            author: 'ahswch',
            url: 'https://jestjs.io/',
            likes: 7
        }
        await api
            .post('/api/blogs')
            .set({
                Authorization: `bearer ${userlogin.body.token}`
            })
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'blog add test'
        )
    })

    test('new blog has default "likes", value is 0', async () => {
        const userlogin = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })
            .expect(200)
        const newBlog = {
            title: 'blog add test1',
            author: 'ahswch',
            url: 'https://jestjs.io/',
        }
        
        await api
            .post('/api/blogs')
            .set({
                Authorization: `bearer ${userlogin.body.token}`
            })
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
    })

    test('blog without title and url is not added', async () => {
        const userlogin = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })
            .expect(200)
        const newBlog = {
            url: 'https://jestjs.io/',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set({
                Authorization: `bearer ${userlogin.body.token}`
            })
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('addition without authorization', async () => {
        const newBlog = {
            title: 'blog add test',
            author: 'ahswch',
            url: 'https://jestjs.io/',
            likes: 7
        }
        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        expect(result.body.error).toContain('invalid token')
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('update of a blog', () => {
    test('update the likes number of blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        let blogToUpdate = _.cloneDeep(blogsAtStart[0])
        blogToUpdate.likes = 999
        
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const result = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        expect(result.likes).toBe(blogToUpdate.likes)
    })
})

describe('when there is initially one user in db', () => {
    // beforeEach(async () => {
    //     await User.deleteMany({})

    //     const passwordHash = await bcrypt.hash('sekret', 10)
    //     const user = new User({ username: 'root', passwordHash })

    //     await user.save()
    // })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
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

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with 400 if password invalid', async () => {

        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test',
            name: 'Superuser',
            password: 'ah'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password missing or password length less than 3')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('faild with statuscode 404 if user does not exist', async () => {
        const user = new User({ username: 'willremovethissoon', password: 'test' })
        await user.save()
        await user.remove()

        const validNonexistingId = user._id.toString()

        await api
            .get(`/api/users/${validNonexistingId}`)
            .expect(404)
    })
})

afterAll(() => {
    mongoose.connection.close()
})