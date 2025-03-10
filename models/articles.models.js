const db = require("../db/connection")
const { countCommentsById } = require("../db/seeds/utils")

exports.selectArticles = () => {
    return db.query(`SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`)
    .then (async({ rows }) => {
        const articlesWithCommentCount = await Promise.all(rows.map(async(article) => {
            const { article_id } = article
            const commentCount = await countCommentsById(article_id)
            article.comment_count =  commentCount
            return article
        }))
        return articlesWithCommentCount
    })
}

exports.selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        } else {
            return rows[0]
        }
    })
}