const express = require('express')
const app = express()
const morgan = require('morgan')
const myql = require('mysql')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('short'))
app.use(express.static('./public'))

const Port = process.env.Port || 8000


app.get('/', (req, res) => {
    console.log('Rendering something at ROOOOOOOT')
    res.send("Oh let's do it!")
})

app.get('/users', (req, res) => {
    res.send("Nodemon auto updates everything")
})


app.listen(8000, () => {
    console.log('Server is up and running on port 8000')
})