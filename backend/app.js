const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors')
const cookie = require('cookie-Parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie());
app.use(fileUpload())


  




//Import all routes 

const products  = require('./routes/product');
const auth  = require('./routes/auth');
const order  = require('./routes/order');

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)

// Middleware handle errors
app.use(errorMiddleware);
    
module.exports = app