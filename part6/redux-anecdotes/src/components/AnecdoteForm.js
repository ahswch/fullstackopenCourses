import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const NewAnecdote = (props) => {
    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnecdote(content)
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                </div>
                <button>add</button>
            </form>
        </>
    )
}

export default connect(
    null,
    { createAnecdote }
)(NewAnecdote)
