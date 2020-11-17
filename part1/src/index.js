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

