"use strict"

const path       = require('path')
const express    = require('express')
const bodyParser = require('body-parser')

let app = express()

// set view engine
app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'ejs' )

// middleware
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: false }) )

app.use( (req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404

  next(err)
})

app.use( (err, req, res, next) => {
  res.status( err.status || 500 )
  console.log(err);
  res.render('error', {
    message: err.message
  })
})

// boot
let port = process.argv[2] || 3000

app.listen( port, () => {
  console.log('Server is listening at %s port', port)
})
