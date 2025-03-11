const db = require("../db/connection")
const { checkValueExists } = require("../utils.app")

exports.selectCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then( async ({ rows }) => {
        if(!rows.length) {
            await checkValueExists("articles", "article_id", id);
        }
        return rows
    })
}

exports.insertCommentIntoArticle = async(username, body, article_id) => {
    if(typeof username !== "string" || typeof body !== "string") {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }
    await checkValueExists("users", "username", username)
    return db.query(`INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`, [username, body, article_id])
    .then(({ rows }) => {
        return rows[0]
    })
}