const mongoose = require('mongoose')
const dns = require('node:dns/promises')

dns.setServers(['1.1.1.1'])

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

console.log(dns.getServers())

const password = encodeURIComponent(process.argv[2])
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://ramapanjinararendra_db_user:${password}@cluster0.xpshfro.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`
// const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
  name: name,
  number: number,
})

person.save().then(() => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })