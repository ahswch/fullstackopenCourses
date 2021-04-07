const _ = require('lodash')
const dummy = (blogs) => {
    return blogs ? 1 : 1
}
const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0 ? 0 : blogs.length === 1 ? blogs[0].likes : blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) => {
    let result = {
        likes: 0
    }

    blogs.forEach(item => {
        if (item.likes > result.likes) {
            result = {
                title: item.title,
                author: item.author,
                likes: item.likes
            }
        }
    })

    return blogs.length === 0 ? {} : result
}
    
const mostBlogs = (blog) => {
    if (blog.length > 1) {
        let countRes = _.countBy(blog, 'author')
        let formatArr = []
        _.keys(countRes).forEach(item => {
            formatArr.push({
                author: item,
                blogs: countRes[item]
            })
        })
        return _.maxBy(formatArr, 'blogs')
    } else if ( blog.length === 1) {
        return {
            author: blog[0].author,
            blogs: 1
        }
    } else {
        return {}
    }
}
const mostLikes = (blog) => {
    if (blog.length > 1) {
        let result = {}
        blog.forEach(item => {
            if(!result[item.author]) {
                result[item.author] = item.likes
            } else {
                result[item.author] += item.likes
            }
        })
        let format = []
        _.keys(result).forEach(item => {
            format.push({
                author: item,
                likes: result[item]
            })
        })
        return _.sortBy(format, 'likes')[format.length - 1]
    } else if ( blog.length === 1) {
        return {
            author: blog[0].author,
            likes: blog[0].likes
        }
    } else {
        return {}
    }
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}