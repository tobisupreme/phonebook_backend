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

/**
 * Get information about phonebook entries
 */
app.get('/info', async (req, res) => {
  Person.find({})
    .then((result) => {
      const resultObj = {}
      resultObj.phonebook = {
        count: result.length,
        date: new Date(),
      }
      return resultObj
    })
    .then((resultObj) => {
      res.render('info', resultObj)
    })
})

/**
 * Get all phonebook entries
 */
app.get('/api/persons', (req, res) => {
  Person.find({}).then((result) => res.json(result))
})

/**
 * Get phonebook entry by id
 */
app.get('/api/persons/:id', async (req, res) => {
  const entryId = req.params.id
  const entry = await Person.findById(entryId)
  if (entry) {
    res.json(entry).end()
  } else {
    res.status(404).end()
  }
})

/**
 * Add phonebook entry
 */
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!(body.name && body.number)) {
    return res.status(400).send({ error: 'You must provide a name and number' }).end()
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson
    .save()
    .then(() => res.json(newPerson))
    .catch((err) => next(err))
})

/* 
 * Update phonebook entry 
 */
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then((returnedObject) => {
      res.json(returnedObject)
    })
    .catch((err) => {
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
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
