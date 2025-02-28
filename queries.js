const db = require("./db/connection")

db.query(`SELECT * FROM users`)
.then(({ rows }) => {
    console.log(rows)
})
.then(() => {
    return db.query(`SELECT * FROM articles WHERE topic = 'coding'`)
})
.then(({ rows }) => {
    console.log(rows)
})
.then(() => {
    return db.query(`SELECT * FROM comments WHERE votes < 0`)
})
.then(({ rows }) => {
    console.log(rows)
})
.then(() => {
    return db.query(`SELECT * FROM topics`)
})
.then(({ rows }) => {
    console.log(rows)
})
.then(() => {
    return db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`)
})
.then(({ rows }) => {
    console.log(rows)
    return
})
.then(() => {
    return db.query(`SELECT * FROM comments WHERE votes > 10`)
})
.then(({ rows }) => {
    console.log(rows)
})
.then(() => {
    db.end()
})
// WHERE topic = coding