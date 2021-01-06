import React from "react";

const Header = ({ text }) => <h3>{text}</h3>;
const Content = ({ parts }) => (parts.map(part => <Part key={part.id} part={part} />))
const Part = ({ part }) => (
    <p>
        {part.name} {part.exercise}
    </p>
);
const Total = ({ parts }) => <h4>total of {parts.reduce((acc, cur) => acc + cur.exercises, 0)} exercises</h4>

const Course = ({ course }) => {
    return (
        <>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    );
};

export default Course;
