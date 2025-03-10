const express = require('express')
const app = express()
const endpoints = require("./endpoints.json")
const { getTopics } = require('./controllers/topics.controllers')

app.get('/api', (req, res) => {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

module.exports = app