const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
