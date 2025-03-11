const { selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentIntoArticle } = require("../models/articles.models")

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

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentOnArticle = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    insertCommentIntoArticle(username, body, article_id).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}