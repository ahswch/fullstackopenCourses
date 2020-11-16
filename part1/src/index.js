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
      <Part text={props.text1}></Part >
      <Part text={props.text2}></Part >
      <Part text={props.text3}></Part >
    </>
  )
}

const Part  = (props) => {
  return (
    <p >{props.text}</p >
  )
}

const Total  = (props) => {
  return (
    <p>{props.total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const  exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <>
      <Header course={course}></Header>
      <Content text1={part1 + exercises1} text2={part2 + exercises2} text3={part3 + exercises3}></Content>
      <Total total={exercises1 + exercises2 + exercises3}></Total>
    </>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

