const express = require('express')
const app = express()

const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})
