"use strict"

const path       = require('path')
const express    = require('express')
const bodyParser = require('body-parser')
const Promise    = require('bluebird')
const mongodb    = require('mongodb')
const GridFS     = require('gridfs-stream')

const MongoClient = mongodb.MongoClient

const config = require('./config/config.json')

// routers
const file_router = require('./routes/file')

let app = express()

// set view engine
app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'ejs' )

// middleware
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: false }) )
app.use( express.static(path.join(__dirname, 'public')) )

// routers
app.use('/files', file_router)

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

// connect to mongo
let url = ['mongodb://', config.mongo_host, '/', config.database].join('')
console.log('mongo url', url)

MongoClient.connect(url)
.then( db => {
  global.db = db
  global.gfs = GridFS(db, mongodb)

  app.listen( port, () => {
    console.log('Server is listening at %s port', port)
  })
})
.catch( err => console.log('mongodb connect failed', err.stack) )
