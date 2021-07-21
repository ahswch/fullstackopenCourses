import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
    const voteClickHandler = (anecdote) => {
        props.vote(anecdote.id, anecdote)
        props.showNotification(`you voted '${anecdote.content}'`, 5)
    }

    return (
        <div>
            {props.anecdotes
                .sort((a, b) => b.votes - a.votes)
                .map((anecdote) => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => voteClickHandler(anecdote)}>
                                vote
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        anecdotes: state.anecdotes.filter(
            (anecdote) => anecdote.content.indexOf(state.filter) > -1
        ),
    }
}

const mapDispatchToProps = {
    vote,
    showNotification,
}

const ConnectAnecdoteList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteList)

export default ConnectAnecdoteList
