"use strict"

const Promise = require('bluebird')
const mongodb   = require('mongodb')

// promisifyAll
const mongo = Promise.promisifyAll( mongodb.MongoClient )

const config = require('./config/config.json')
