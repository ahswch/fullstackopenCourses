import React, { useState, useEffect } from "react";
import personService from './services/persons'

const Filter = ({ filterName, handleFilterNameChange }) => <div>filter shown with <input value={filterName} onChange={handleFilterNameChange} /></div>
const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, handleSubmitClick}) => (
    <form>
        <div>
            name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
            number: <input type="number" value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
            <button onClick={handleSubmitClick} type="submit">
                add
            </button>
        </div>
    </form>
)
const Persons = ({ personsToShow, handleDeleteClick}) => (
    personsToShow.map((person) => (
        <div key={person.name}>
            {person.name} {person.number}
            <button onClick={() => handleDeleteClick(person)}>delete</button>
        </div>
    ))
)

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    const successStyle = {
        color: 'green',
        backgroundColor: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        boderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    const errorStyle = {
        color: 'red',
        backgroundColor: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        boderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    return (
        <div style={message.type === 'success' ? successStyle : errorStyle}>{message.text}</div>
    )
}

const App = (props) => {
    useEffect(() => {
        personService.getAll().then(initialPersons => {
            setPersons(initialPersons)
        })
    }, [])

    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filterName, setFilterName] = useState("");
    const [notification, setNotification] = useState(null)

    const handleNameChange = (event) => setNewName(event.target.value);
    const handleNumberChange = (event) => setNewNumber(event.target.value);
    const handleFilterNameChange = (event) => setFilterName(event.target.value);
    const personsToShow = persons.filter(person => person.name.toLowerCase().indexOf(filterName) > -1)

    const handleSubmitClick = (event) => {
        event.preventDefault();
        if (newName.length === 0 || newNumber.length === 0) {
            alert("Your should fill all input");
            return;
        }

        let newObject = {
            name: newName,
            number: newNumber,
        };

        if (persons.some((person) => person.name === newName)) {
            const check = persons.find(n => n.name === newName);

            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                personService.update(check.id, newObject).then(returnedPerson => {
                    setPersons(persons.map(n => n.id === returnedPerson.id ? returnedPerson : n))
                    setNotification({
                        type: 'success',
                        text: `Updated ${returnedPerson.name}`
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000);
                })
                .catch(error => {
                    setNotification({
                        type: 'error',
                        text: `Information of ${check.name} has already been removed from server`
                    })
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000);
                })
            }
            return;
        }

        personService.create(newObject).then(returnedPerson => {
            setPersons(persons.concat(returnedPerson));
            setNewName("");
            setNewNumber("");
            setNotification({
                type: 'success',
                text: `Added ${returnedPerson.name}`
            })
            setTimeout(() => {
                setNotification(null)
            }, 5000);
        })
    };

    const deletePerson = (person) => {
        console.log(person)
        if (window.confirm(`Delete ${person.name} ?`)) {
            personService.deletePerson(person.id).then(result => {
                console.log(result)
                setPersons(persons.filter(item => item.id !== person.id))
            })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notification}></Notification>
            <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
            <h2>Add a new</h2>
            <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} handleSubmitClick={handleSubmitClick} />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} handleDeleteClick={deletePerson} />
        </div>
    );
};

export default App;
