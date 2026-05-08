const mongoose = require('mongoose')
const dns = require('node:dns/promises')

dns.setServers(['1.1.1.1'])

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

console.log(dns.getServers())

const password = encodeURIComponent(process.argv[2])
console.log(password)

const url = `mongodb+srv://ramapanjinararendra_db_user:${password}@cluster0.xpshfro.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
// const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})