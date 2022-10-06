const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB', err.message))

const peopleSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (num) {
        if (num.indexOf('-') !== -1) {
          return /^\d{2,3}-\d+$/.test(num)
        } else {
          return /^\d+$/.test(num)
        }
      },
      message: num => `${num.value} is not a valid phone number. Use only digits. If formed of two parts, use the format xx-xxxxxx or xxx-xxxxxxx where x is a digit`,
    },
  },
})

peopleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', peopleSchema)
