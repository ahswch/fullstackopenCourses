import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createAnecdote = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const voteAnecdote = async (id, anecdote) => {
    const changeItem = {
        ...anecdote,
        votes: anecdote.votes + 1
    }
    const response = await axios.put(`${baseUrl}/${id}`, changeItem)
    return response.data
}

let anecdote = {
    getAll,
    createAnecdote,
    voteAnecdote
}
export default anecdote
