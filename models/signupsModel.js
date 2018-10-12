const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoport = process.env.MONGO_PORT
const mongohost = process.env.MONGO_HOST
mongoose.connect(`mongodb://${mongohost}:${mongoport}`)

/**
 * Signup records
 */
const signupsSchema = new Schema({
  name: String,
  email: String,
  nationality: String,
  locale: {
    type: String,
    default: 'en'
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Signups', signupsSchema)