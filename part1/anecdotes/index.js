import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Title = ({ text }) => <h2>{text}</h2>
const Display = ({ text }) => <p>{text}</p>
const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)
  const [voteList, setVoteList] = useState(new Array(anecdotes.length + 1).join('0').split('').map(parseFloat))

  const getRandomIndex = () => parseInt(Math.random() * props.anecdotes.length)
  const vote = () => {
    let res = [...voteList]
    res[selected]++
    setVoteList(res)

    // getMostVoted
    setMostVoted(res.indexOf(Math.max(...res)))
  }

  return (
    <div>
      <Title text="Anecdote of the day" />
      <Display text={props.anecdotes[selected]} />
      <Display text={'has ' + voteList[selected] + ' votes'} />
      <Button text="vote" handleClick={vote} />
      <Button text="next anecdote" handleClick={() => setSelected(getRandomIndex())} />

      <Title text="Anecdote with most votes" />
      <Display text={props.anecdotes[mostVoted]} />
      <Display text={'has ' + voteList[mostVoted] + ' votes'} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)