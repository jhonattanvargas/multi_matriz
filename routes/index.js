'use strict'

const express = require('express')
const api = express.Router()
//add require controller
const calculatorCtrl = require('../controllers/calculator')

//add routes from api
api.post('/serial',calculatorCtrl.serial)
api.post('/parallel',calculatorCtrl.parallel)
api.post('/test',calculatorCtrl.test)
api.get('/multi',calculatorCtrl.multi)

module.exports = api
