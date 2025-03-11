const db = require("../db/connection")

exports.selectArticles = () => {
    return db.query(`SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`)
    .then(({ rows }) => {
        return rows
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

exports.updateArticleVotesById = (id, inc_votes) => {
    if(inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        } else {
            return rows[0]
        }
    })
}