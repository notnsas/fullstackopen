import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filt, setfilt] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [messageType, setMessageType] = useState("notif")
  
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])
  console.log('render', persons.length, 'persons')

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

  const showNotifMessage = (message, newMessageType) => {
    console.log("newMessageType", newMessageType)
    console.log("message", message)
    setNotifMessage(message)
    setMessageType(newMessageType)
    setTimeout(() => {
      setNotifMessage(null)
    }, 2000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const samePerson = persons.find((n) => n.name === newName)
    const personObject = {
      name: newName,
      number: newNumber,
    }
    console.log("sameperson ", samePerson)
    console.log("newName ", newName)
    console.log("cond second if", (samePerson && samePerson.name === newName))
    
    if (samePerson && samePerson.number !== newNumber && confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      console.log("samePerson", samePerson);
      console.log("personObject", personObject);
      personService
        .update(samePerson.id, personObject)
        .then((returnedPerson) => {
          setPersons(persons.map((person) => (person.id !== samePerson.id ? person : returnedPerson)))
        })
        .catch((error) => {
          console.log("Already deleted in server cant change num")
          showNotifMessage(`Information of ${samePerson.name} has already been removed from server` , "error")
          setPersons(persons.filter((n) => n.id !== samePerson.id))
          return
        })
      // setNotifMessage(`Changed ${newName} number`)
      showNotifMessage(`Changed ${newName} number`, "notif")
      return
      } else if (samePerson && samePerson.name === newName) {
        alert(`${newName} is already added to phonebook`)
        return
    } 
    
    console.log("Added person")

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
    // setNotifMessage(`Added ${newName}`)
    // setTimeout(() => {
    //   setErrorMessage(null)
    // }, 5000)
    showNotifMessage(`Added ${newName}`, "notif")
  }

  const handleDelete = (id) => {
    console.log("persons", persons)
    console.log("id", id)

    const person = persons.find((n) => n.id === id)
    const newPersons = persons.filter((n) => n.id !== id)

    if (!confirm(`Delete ${person.name}?`)) {
      return
    }
    
    console.log("newPersons", newPersons)
    personService
      .deletePerson(id)
      .then((returnedPerson) => {
        setPersons(newPersons)
      })
      .catch((error) => {
        // alert(`the person '${person.name}' was already deleted from server`)
        console.log("Deleting...")
        showNotifMessage(`the person '${person.name}' was already deleted from server` , "error")
        setPersons(newPersons)
      })
  }

  // const toggleImportanceOf = (id) => {
  //   const note = notes.find((n) => n.id === id)
  //   const changedNote = { ...note, important: !note.important }

  //   noteService
  //     .update(id, changedNote)
  //     .then((returnedNote) => {
  //       setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
  //     })
  //     .catch((error) => {
  //       // alert(`the note '${note.content}' was already deleted from server`)
  //       showNotifMessage(`the person '${person.name}' was already deleted from server` , "error")
  //       setNotes(notes.filter((n) => n.id !== id))
  //     })
  // }
  console.log("messageType", messageType)
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} messageType={messageType}/>
      <Filter filt={filt} handleFiltChange={handleFiltChange}/>

      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson}/>

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} onDelete={handleDelete}/>
    </div>
  )
}

export default App