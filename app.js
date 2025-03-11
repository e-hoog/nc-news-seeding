const express = require('express')
const app = express()
const endpoints = require("./endpoints.json")
const { getTopics } = require('./controllers/topics.controllers')
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("./controllers/error.controllers")
const { getArticleById, getArticles, patchArticleVotesById } = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postCommentOnArticle, deleteCommentById } = require('./controllers/comments.controllers')
const { getUsers } = require('./controllers/users.controllers')

app.use(express.json())

app.get('/api', (req, res) => {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentOnArticle)

app.patch('/api/articles/:article_id', patchArticleVotesById)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api/users', getUsers)

app.all(`*`, (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app