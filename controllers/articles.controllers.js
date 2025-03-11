const { selectArticleById, selectArticles, updateArticleVotesById } = require("../models/articles.models")

exports.getArticles = (req, res) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles} )
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotesById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}