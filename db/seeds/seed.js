const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate, createLookupObject } = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics;");
  })
  .then(() => {
    return createTopics()
  })
  .then(() => {
    return createUsers()
  })
  .then(() => {
    return createArticles()
  })
  .then(() => {
    return createComments()
  })
  .then(() => {
    return insertTopicsData(topicData)
  })
  .then(() => {
    return insertUsersData(userData)
  })
  .then(() => {
    return insertArticlesData(articleData)
  })
  .then(({ rows }) => {
    return insertCommentsData(commentData, rows)
  })
};
module.exports = seed;

function createTopics() {
  return db.query(`CREATE TABLE topics(
    slug VARCHAR(50) PRIMARY KEY UNIQUE,
    description VARCHAR(1000) NOT NULL,
    img_url VARCHAR(1000));`)
}

function createUsers() {
  return db.query(`CREATE TABLE users(
    username VARCHAR(32) PRIMARY KEY UNIQUE,
    name VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(1000));`)
}

function createArticles() {
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    topic VARCHAR(50) REFERENCES topics(slug),
    author VARCHAR(32) REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000));`)
}

function createComments() {
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(32) REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)
}

function insertTopicsData(data) {
  const formattedTopics = data.map((topic) => {
    return [topic.slug, topic.description, topic.img_url]
  })
  const insertTopicsString = format(`INSERT INTO topics(slug, description, img_url) VALUES %L;`, formattedTopics)
  return db.query(insertTopicsString)
}

function insertUsersData(data) {
  const formattedUsers = data.map((user) => {
    return [user.username, user.name, user.avatar_url]
  })
  const insertUsersString = format(`INSERT INTO users(username, name, avatar_url) VALUES %L;`, formattedUsers)
  return db.query(insertUsersString)
}

function insertArticlesData(data) {
  const formattedArticles = data.map((article) => {
    const articleWithDate = convertTimestampToDate(article)
    return [
      articleWithDate.title, 
      articleWithDate.topic, 
      articleWithDate.author, 
      articleWithDate.body,
      articleWithDate.created_at,
      articleWithDate.votes,
      articleWithDate.article_img_url
    ]
  })
  const insertArticlesString = format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L;`, formattedArticles)
  return db.query(insertArticlesString)
}

function insertCommentsData(commentData, articleData) {
  const articleLookup = createLookupObject(articleData, "article_name", "article_id")
  const formattedComments = commentData.map((comment) => {
    const commentWithDate = convertTimestampToDate(comment)
    return [
      articleLookup[commentWithDate.article_title], 
      commentWithDate.body, 
      commentWithDate.votes, 
      commentWithDate.author,
      commentWithDate.created_at,
    ]
  })
  const insertCommentsString = format(`INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L;`, formattedComments)
  return db.query(insertCommentsString)
}