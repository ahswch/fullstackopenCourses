# Part 0

## a

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = ()=> {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

```

### Exercises

**detail in commit*

## b

```javascript
  import React from 'react';
  import ReactDOM from 'react-dom';

  const Header = (props) => {
    return (
    <h1>{props.course}</h1>
    )
  }

  const Content = (props) => {
    return (
      <>
        <Part part={props.parts[0]}></Part >
        <Part part={props.parts[1]}></Part >
        <Part part={props.parts[2]}></Part >
      </>
    )
  }

  const Part  = (props) => {
    return (
      <p >{props.part.name} {props.part.exercises}</p >
    )
  }

  const Total  = (props) => {
    return (
      <p>{props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    )
  }

  const App = () => {
    const course = {
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          name: 'State of a component',
          exercises: 14
        }
      ]
    }

    return (
      <>
        <Header course={course.name}></Header>
        <Content parts={course.parts}></Content>
        <Total parts={course.parts}></Total>
      </>
    )
  }

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
```

## c

```javascript
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Display = ({counter}) => <div>{counter}</div>

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter} />
      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />
      <Button
        handleClick={decreaseByOne}
        text='minus'
      />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

```

## d

### unicafe

### anecdotes
