import { useState, useEffect } from 'react'
import FindCountry from './components/FindCountry'
import countryService from './services/countries'
import DisplayCountries from './components/DisplayCountries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newCountry, setNewCountry] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    countryService.getCountries().then((initialCountries) => {
      // console.log("Start");
      setCountries(initialCountries)
      // console.log("filteredCountries", filteredCountries);
    })
  }, [])

  const filteredCountries = countries.filter((country) => {
    // console.log("country.name.common", country.name.common)
    // const filt = country.name.common.some((spelling) => spelling.toLowerCase().includes(newCountry.toLowerCase()))
    const filt = country.name.common.toLowerCase().includes(newCountry.toLowerCase())
    return filt
  })
  // const addNote = (event) => {
  //   event.preventDefault()
  //   const noteObject = {
  //     content: newNote,
  //     important: Math.random() > 0.5,
  //   }

  //   noteService.create(noteObject).then((returnedNote) => {
  //     setNotes(notes.concat(returnedNote))
  //     setNewNote('')
  //   })
  // }

  // const toggleImportanceOf = (id) => {
  //   const note = notes.find((n) => n.id === id)
  //   const changedNote = { ...note, important: !note.important }

  //   noteService
  //     .update(id, changedNote)
  //     .then((returnedNote) => {
  //       setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
  //     })
  //     .catch((error) => {
  //       alert(`the note '${note.content}' was already deleted from server`)
  //       setNotes(notes.filter((n) => n.id !== id))
  //     })
  // }

  const handleCountryChange = (event) => {
    setNewCountry(event.target.value)
  }

  // const notesToShow = showAll ? notes : notes.filter((note) => note.important)
  // console.log("newCountry", newCountry)
  return (
    <div>
      <FindCountry newCountry={newCountry} onChange={handleCountryChange}/>
      <DisplayCountries countries={filteredCountries}/>
    </div>
  )
}

export default App