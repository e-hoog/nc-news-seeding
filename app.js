const express = require('express')
const app = express()
const endpoints = require("./endpoints.json")
const { getTopics } = require('./controllers/topics.controllers')
const { handleServerErrors, handleCustomErrors } = require("./controllers/error.controllers")
const { getArticleById } = require('./controllers/articles.controllers')

app.get('/api', (req, res) => {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.all(`*`, (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app