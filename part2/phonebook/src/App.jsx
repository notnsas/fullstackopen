import { useState } from 'react'

const Display = (props) => (
  <div>
    {props.name} {props.number}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filt, setfilt] = useState('')
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filt.toLowerCase()))
  console.log("personsToShow", personsToShow)
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFiltChange = (event) => {
    console.log(event.target.value)
    setfilt(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((obj) => obj.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    console.log("Added person")

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <input value={filt} onChange={handleFiltChange}/></div>
      <h2>add a new</h2>
      <form>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div><button onClick={addPerson} type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person => <Display key={person.id} name={person.name} number={person.number}/>)}
    </div>
  )
}

export default App