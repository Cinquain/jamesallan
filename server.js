const express = require('express')
const app = express()
const morgan = require('morgan')
const myql = require('mysql')
const bodyParser = require('body-parser')
const request = require('superagent')


app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('short'))
app.use(express.static('./public'))

const Port = process.env.Port || 8000

app.listen(8000, () => {
    console.log('Server is up and running on port 8000')
})

app.get('/', (req, res) => {
   res.render('index.html')
})

app.post('/health_subscriber', (req, res, err) => {
    var name = req.body.name
    var email = req.body.email
    var city = req.body.city
    var list = ''

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)

})

app.post('/wealth_subscriber', (req, res, err) => {
    var name = req.body.name
    var email = req.body.email
    var city = req.body.city
    var list = ''

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)
})

app.post('/success_subscriber', (req, res, err) => {
    var name = req.body.name
    var email = req.body.email
    var city = req.body.city
    var list = ''

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)
})

app.post('/all_subscriber', (req, res, err) => {
    var name = req.body.name
    var email = req.body.email
    var city = req.body.city
    var list = ''

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)
})



function saveToMailchimp(name, email, city, list) {
    var request = require('request')

    const data = {
        members: [
            {
                email_address: email, 
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    TEXTYUI_3: city
                }
            }
        ]
    }

    const postData = JSON.stringify(data)

    const options = { 
        url: 'https://us7.api.mailchimp.com/3.0/lists/' + list,
        method: 'POST',
        headers: { 
            Authorization: 'auth 2d49af1f4e73a69ab208d07a27b5c768-us7'
        },
        body: postData 
        };

    request(options, function(error, response, body) {
        if (error) {
            console.log('Error saving to mailchimp')
        } else if (response.statusCode === 200) {
            console.log('saved to mailchimp')
        }
    })
}