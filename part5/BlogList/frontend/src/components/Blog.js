import React, { useState } from 'react'
const Blog = ({ blog, addLike, removeBlog, canDelete }) => {
    const [detailVisible, setDetailVisible] = useState()
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const deleteBtnStyle = {
        backgroundColor: 'red',
        color: '#fff',
        display: canDelete ? '' : 'none'
    }

    const detailStyle = { display: detailVisible ? '' : 'none' }
    const toggleDetailShow = () => {
        setDetailVisible(!detailVisible)
    }

    const addLikeClick = () => {
        const obj = {
            ...blog,
            user: blog.user.id,
            likes: blog.likes + 1
        }
        addLike(obj.id, obj)
    }
    const removeBlogClick = () => {
        if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            removeBlog(blog.id)
        }
    }

    return (
        <div style={blogStyle} className='blogContent'>
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleDetailShow}>{detailVisible ? 'hide' : 'view'}</button>
            </div>
            <div style={detailStyle} className='detailContent'>
                <div>{blog.url}</div>
                <div>
                    <span>likes: {blog.likes}</span>
                    <button onClick={addLikeClick}>like</button>
                </div>
                <div>{blog.author}</div>
                <button id='like-button' style={deleteBtnStyle} onClick={removeBlogClick}>remove</button>
            </div>
        </div>
    )
}

export default Blog