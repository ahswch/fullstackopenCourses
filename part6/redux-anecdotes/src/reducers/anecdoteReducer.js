import anecdoteService from "../services/anecdote"
const reducer = (state = [], action) => {
    switch (action.type) {
        case 'VOTE': {
            const id = action.data.id
            return state.map((item) => (item.id !== id ? item : action.data))
        }
        case 'CREAT':
            return [...state, action.data]
        case 'INIT':
            return action.data
        default:
            return state
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createAnecdote(content)
        dispatch({
            type: 'CREAT',
            data: newAnecdote
        })
    }
}

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch({
            type: 'INIT',
            data: anecdotes
        })
    }
}

export const vote = (id, anecdote) => {
    return async dispatch => {
        const res = await anecdoteService.voteAnecdote(id, anecdote)
        dispatch({
            type: 'VOTE',
            data: res
        })
    }
}

export default reducer
