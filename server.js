require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')

app.use(express.json())
app.use(express.static('build'))
app.set('view engine', 'ejs')
app.use(cors())

morgan.token('reqBody', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :reqBody'))

app.get('/info', (req, res) => {
  Person.find({})
    .then((result) => {
      const resultObj = {}
      resultObj.phonebook = {
        count: getNumberOfEntries(result),
        date: new Date(),
      }
      return resultObj
    })
    .then((resultObj) => {
      res.render('info', resultObj)
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((result) => res.json(result))
})

app.get('/api/persons/:id', (req, res) => {
  const entryId = Number(req.params.id)
  const entry = entries.find((entry) => entry.id === entryId)
  if (entry) {
    res.send(entry).end()
  } else {
    res.status(404).end()
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 9999999)
}

function checkDuplicate(name) {
  let entryNames = entries.map((entry) => entry.name.toLocaleLowerCase())

  for (let i = 0; i < entryNames.length; i++) {
    if (entryNames[i] == name.toLocaleLowerCase()) {
      return true
    }
  }

  return false
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!(body.name && body.number)) {
    return res.status(400).send({ error: 'You must provide a name and number' }).end()
  } /* else if (checkDuplicate(body.name)) {
    return res.status(400).send({ error: 'Name must be unique' }).end()
  } */

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save().then(() => res.json(newPerson))
})

/* 
 * Update phonebook entry 
 */
app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, updatedPerson, {new: true})
    .then((returnedObject) => {
      res.json(returnedObject)
    })
    .catch(err => {
      next(err)
    })
})

/**
 * Delete phonebook entries
 */
app.delete('/api/persons/:id', (req, res, next) => {
  const entryId = req.params.id
  Person.findByIdAndRemove(entryId)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
})

/**
 * Error handler
 */
const errorHandler = (error, req, res, next) => {

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Unable to lookup person with provided ID' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
