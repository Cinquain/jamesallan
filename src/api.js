const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeLiveKey = process.env.STRIPE_LIVE_KEY
const stripe = require('stripe')(stripeLiveKey);




router.get('/', (req, res) => {
    res.json({
        'hello': 'hi'
    });
});

// Book Purchase Routes
router.post('/purchase', (req, res) => {
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

router.get('/download', (req, res) => {
    res.download(path.join(__dirname, 'public/assets/Become_More_Intelligent.pdf'), (err) => {
        console.log(err)
    });
    console.log('Ebook has been downloaded')
});


// Signup Routes


router.post('/health', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.HEALTH_LIST

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list, res)
})


router.post('/wealth', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.WEALTH_LIST


    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list, res)
})


router.post('/success', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.SUCCESS_LIST

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list, res)
})

router.post('/all', (req, res, err) => {
    var name = req.body.fullname
    var email = req.body.email
    var city = req.body.city
    var list = process.env.JAMES_ALLAN_ALL

    console.log(name, email, city, list)
    saveToMailchimp(name, email, city, list, res)
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
            Authorization: process.env.MAILCHIMP_KEY
        },
        body: postData 
        };


    request(options, function(error, response, body) {
        if (error) {
            console.log('Error saving to mailchimp')
        } else if (response.statusCode === 200) {
            console.log('saved to mailchimp')
            res.redirect('index.html')
            res.end()
        }
    });
}



app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app)