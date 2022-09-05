const express = require('express')
const app = express()

app.use(express.json())
app.set('view engine', 'ejs')

let entries = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Yemi Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Esther Poppendieck',
    number: '39-23-6423122',
  },
]

const getNumberOfEntries = () => {
  return entries.length
}

app.get('/info', (req, res) => {
  res.render('info', {
    phonebook: {
      count: getNumberOfEntries(),
      date: new Date(),
    },
  })
})

app.get('/api/persons', (req, res) => {
  res.json(entries).end()
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
  } else if (checkDuplicate(body.name)) {
    return res.status(400).send({ error: 'Name must be unique' }).end()
  }

  const newPerson = {
    id: generateId(),
    name: req.body.name,
    number: req.body.number,
  }
  entries = entries.concat(newPerson)
  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const entryId = Number(req.params.id)
  entries = entries.filter((entry) => entry.id != entryId)
  res.status(204).end()
})

const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
