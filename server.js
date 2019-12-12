const express = require('express')
const app = express()
const morgan = require('morgan')
const myql = require('mysql')
const bodyParser = require('body-parser')
const request = require('request')
const path = require('path')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('short'))
app.use(express.static('./public'))

const PORT = process.env.PORT || 8000

const pool = myql.createConnection( {
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b9bc95ae944364',
    password: '63d9d15b',
    database: 'heroku_9ac93b6b6935406'
})


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeTestKey = process.env.STRIPE_SECRET_TEST
const stripe = require('stripe')(stripeTestKey);


app.listen(PORT, () => {
    console.log('Server is up and running on port 8000')
})



app.get('/', (req, res) => {
   res.render('index.html')
})

app.post('/health', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.HEALTH_LIST

    const queryString = "INSERT INTO health (name, email, city) VALUES (?, ?, ?)"
    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)

    pool.query(queryString, [name, email, city], (error, results, fields) => {
        if (error) {
            console.log('Failed to insert new user into mysql database' + error)
            res.sendStatus(500)
            return
        }
        console.log('Successfully inserted new user')
        res.redirect('index.html')
        res.end()
    })

})

app.get('/download', (req, res) => {
    res.download(path.join(__dirname, 'public/assets/Become_More_Intelligent.pdf'), (err) => {
        console.log(err)
    });
    console.log('Ebook has been downloaded')
});

app.post('/wealth', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.WEALTH_LIST

    const queryString = "INSERT INTO wealth (name, email, city) VALUES (?, ?, ?)"

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)

    pool.query(queryString, [name, email, city], (error, results, fields) => {
        if (error) {
            console.log('Failed to insert new user into mysql database' + error)
            res.sendStatus(500)
            return
        }
        console.log('Successfully inserted new user')
        res.redirect('index.html')
        res.end()
    })

})

app.post('/success', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.SUCCESS_LIST

    const queryString = "INSERT INTO success (name, email, city) VALUES (?, ?, ?)"

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)

    pool.query(queryString, [name, email, city], (error, results, fields) => {
        if (error) {
            console.log('Failed to insert new user into mysql database' + error)
            res.sendStatus(500)
            return
        }
        console.log('Successfully inserted new user')
        res.redirect('index.html')
        res.end()
    })

})

app.post('/all', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.JAMES_ALLAN_ALL

    const queryString = "INSERT INTO all_james_allan (name, email, city) VALUES (?, ?, ?)"

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list)

    pool.query(queryString, [name, email, city], (error, results, fields) => {
        if (error) {
            console.log('Failed to insert new user into mysql database' + error)
            res.sendStatus(500)
            return
        }
        console.log('Successfully inserted new user')
        res.redirect('index.html')
        res.end()
    })
});


app.post('/purchase', (req, res) => {
    const amount = 650
    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount: amount, 
        description: 'Become More Intelligent Ebook',
        currency: 'usd',
        customer: customer.id 
    }))
    .then(charge => res.redirect('success.html'));
});

function saveToMailchimp(name, email, city, list) {

    var request = require('superagent')
    const base = 'https://us18.api.mailchimp.com/3.0/lists/' 
    const url = base.concat(list) + '/members'
    console.log(url)

    const data = {
        members: [
            {
                email_address: email, 
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    MMERGE2: city
                }
            }
        ]
    }
   
    const postData = JSON.stringify(data)

    const options = { 
        url: url,
        method: 'POST',
        headers: { 
            Authorization: process.env.CX_Key
        },
        body: postData 
        };


    request(options, function(error, response, body) {
        if (error) {
            console.log('Error saving to mailchimp')
        } else if (response.statusCode === 200) {
            console.log('saved to mailchimp')
        }
    });
}