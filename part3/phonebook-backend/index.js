require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

// let persons = []
console.log('TEST')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log('Start to log error')

  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan(':url :status :res[content-length] :response-time ms :body'))
// app.use(unknownEndpoint) test

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const nowDate = new Date()
  Person.find({}).then(persons => {
    console.log('persons', persons.length)
    const infoText = (`
        <p>Phonebook has info for ${persons.length} people<p/> 
        <p>${nowDate}<p/>
        `
    )
    response.send(infoText)
  })
  // .catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
  console.log('test')

  Person.find({}).then(persons => {
    console.log('persons', persons)
    response.json(persons)
  })
  // .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    console.log('person', person)

    response.json(person)
  })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('body', body)
  console.log('body.content', body.content)
  console.log('Start to make person', body)

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log('person', person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log('Running put')
  const { name, number } = request.body
  const opts = { runValidators: true }

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save(opts).then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => {
      console.log('Validator ke run buat update')

      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})