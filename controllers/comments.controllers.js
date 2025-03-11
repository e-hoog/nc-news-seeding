const { selectCommentsByArticleId, insertCommentIntoArticle } = require("../models/comments.models")

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