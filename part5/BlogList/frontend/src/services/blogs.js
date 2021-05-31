import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const updateLike = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            return Promise.reject({
                code: 401,
                error: 'login status expired or invalid token, please login again'
            })
        } else {
            return Promise.reject({
                code: -1,
                ...error.response.data
            })
        }
    }
)

export default {
    getAll,
    create,
    update,
    updateLike,
    deleteBlog,
    setToken
}
