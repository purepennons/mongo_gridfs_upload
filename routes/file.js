"use strict"

const Promise  = require('bluebird')
const ObjectID = require('mongodb').ObjectID

// promisifyAll
const multiparty = Promise.promisifyAll( require('multiparty') )

const router = require('express').Router()


router.post('/', ( req, res, next ) => {
  let form = new multiparty.Form()
  let fileInfo = []

  form.on('part', part => {
    if(!part.filename) {
      console.log('Field name', part.name)
      part.resume()
    }

    if(part.filename) {
      let objectId = new ObjectID()
      let writableStream = global.gfs.createWriteStream({
        _id: objectId,
        filename: part.filename
      })
      part.pipe( writableStream )

      // writableStream events
      writableStream.on('error', err => {
        console.error('[ERROR]', err.statck)
        res.status(417).json({
          status: 'error',
          description: 'Something wrong when uploading the file'
        })
      })

      writableStream.on('close', file => {

      })

      // record the file information
      fileInfo.push({
        _id: objectId,
        filename: part.filename
      })
    }

    // part events
    part.on('error', err => {
      console.error('[ERROR]', err.stack)
      res.status(417).json({
        status: 'error',
        description: 'Something wrong when uploading the file'
      })
    })
  })

  // form events
  form.on('error', err => {
    console.error('[ERROR]', err.stack)
    res.status(406).json({
      status: 'error',
      description: 'Parsing form failed'
    })
  })

  form.on('close', () => {
    res.status(201).json({
      status: 'success',
      description: 'upload a file successfully',
      data: fileInfo
    })
  })

  // form parsing
  form.parse(req)

})

module.exports = router;
