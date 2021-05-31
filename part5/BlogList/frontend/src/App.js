import React, { useState, useEffect , useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNotification] = useState(null)
    const blogFormRef = useRef()

    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])
    const addBlog = (blogObject) => {
        blogService
            .create(blogObject)
            .then((returnedBlog) => {
                setBlogs(blogs.concat(returnedBlog))

                setNotification({
                    type: 'success',
                    text: `a new blog ${ returnedBlog.title } by ${ returnedBlog.author } added`
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
                blogFormRef.current.toggleVisibility()
            }).catch(e => {
                setNotification({
                    type: 'error',
                    text: `${e.error}`
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
                if (e.code === 401) {
                    logout()
                }
            })

    }

    const addBlogLike = (id, blogObject) => {
        blogService
            .updateLike(id, blogObject)
            .then(() => {
                blogService.getAll().then(blogs =>
                    setBlogs( blogs )
                )

                setNotification({
                    type: 'success',
                    text: 'success'
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            }).catch(e => {
                setNotification({
                    type: 'error',
                    text: `${e.error}`
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
                if (e.code === 401) {
                    logout()
                }
            })

    }

    const deleteBlog = (id) => {
        blogService
            .deleteBlog(id)
            .then(() => {
                blogService.getAll().then(blogs =>
                    setBlogs( blogs )
                )

                setNotification({
                    type: 'success',
                    text: 'delete success'
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
            }).catch(e => {
                setNotification({
                    type: 'error',
                    text: `${e.error}`
                })
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
                if (e.code === 401) {
                    logout()
                }
            })

    }

    const handleLogin = async ({ username, password }) => {
        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedBlogUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
        } catch (exception) {
            setNotification({
                type: 'error',
                text: 'Wrong credentials'
            })
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        <Togglable buttonLabel='log in'>
            <LoginForm login={handleLogin}></LoginForm>
        </Togglable>
    )

    const blogForm = () => (
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog}></BlogForm>
        </Togglable>
    )

    const logout = () => {
        window.localStorage.removeItem('loggedBlogUser')
        blogService.setToken('')
        setUser(null)
    }

    const blogShow = () => (
        <div>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog
                    addLike={addBlogLike}
                    removeBlog={deleteBlog}
                    canDelete={user === null ? false : (user.username === blog.user.username && user.name === blog.user.name)}
                    key={blog.id}
                    blog={blog}
                />
            )}
        </div>
    )

    return (
        <>
            <h1>blogs</h1>

            <Notification message={notification} />

            {user === null ?
                loginForm() :
                <div>
                    <p>
                        {user.name} logged in
                        <button onClick={logout}>logout</button>
                    </p>
                    {blogForm()}
                </div>
            }


            {blogShow()}
        </>
    )
}

export default App