const connectToMongo = require('./db');
const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

connectToMongo();
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello Ravi!')
})
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/note', require('./routes/note.js'))

app.listen(port, () => {
  console.log(`iNotebook listening on port ${port}`)
})