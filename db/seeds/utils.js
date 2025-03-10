const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookupObject = (databaseRow = [], targetKey, targetValue) => {
  const lookup = {}
  databaseRow.forEach((data) => {
      lookup[data[targetKey]] = data[targetValue]
  })
  return lookup
}

exports.countCommentsById = (article_id) => {
  return db.query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
  .then(({ rows }) => {
    console.log(rows, "<<< rows")
    const commentCount = rows.length
    return commentCount
})
}