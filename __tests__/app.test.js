const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
require("jest-sorted")
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("ALL /notARoute", () => {
  test("404: Responds with an error message if path given is not a valid endpoint", () => {
    return request(app)
      .get("/api/treasure")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array containing correct data on all topics", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          const { slug, description } = topic
          expect(typeof slug).toBe('string')
          expect(typeof description).toBe('string')
        })
      })
  })
})

describe("GET /api/articles", () => {
  test('200: responds with an array containing correct data on all articles', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body : { articles } }) => {
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("created_at", {
        descending: true
      })
      articles.forEach((article) => {
        expect(article).toHaveProperty("article_id")
        expect(article).toHaveProperty("title")
        expect(article).toHaveProperty("topic")
        expect(article).toHaveProperty("author")
        expect(article).toHaveProperty("created_at")
        expect(article).toHaveProperty("votes")
        expect(article).toHaveProperty("article_img_url")
        expect(article).toHaveProperty("comment_count")
        expect(article).not.toHaveProperty("body")
      })
    })
  });  
});

describe("GET /api/articles/:article_id", () => {
  test('200: Responds with an object containing correct data on the article with given id', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body: { article } }) => {
        const { author, title, article_id, body, topic, created_at, votes, article_img_url } = article
        expect(article_id).toBe(3)
        expect(typeof author).toBe('string')
        expect(typeof title).toBe('string')
        expect(typeof body).toBe('string')
        expect(typeof topic).toBe('string')
        expect(typeof created_at).toBe('string')
        expect(typeof votes).toBe('number')
        expect(typeof article_img_url).toBe('string')
      })
  })
  test("404: responds with an error message when passed an id not in the database", () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Not Found");
      });
  });
  test("400: responds with an error message if not passed a number", () => {
    return request(app)
      .get("/api/articles/notANumber")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test('200: Responds with an object containing correct data on the comments with the given article_id', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThan(0)
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id")
          expect(comment).toHaveProperty("votes")
          expect(comment).toHaveProperty("created_at")
          expect(comment).toHaveProperty("author")
          expect(comment).toHaveProperty("body")
          expect(comment).toHaveProperty("article_id", 3)
        })
      })
  })
  test("200: responds with an empty array when passed id is present in the articles table but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("404: responds with an error message when passed id not present in the articles table", () => {
    return request(app)
      .get("/api/articles/10000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Not Found");
      });
  });
  test("400: responds with an error message if not passed a number", () => {
    return request(app)
      .get("/api/articles/notANumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test('201: Responds with an object containing the posted comment data if given a valid article id and body', () => {
    return request(app)
      .post('/api/articles/3/comments')
      .send({
        username : "butter_bridge",
        body : "this one really speaks to me as a person"
      })
      .expect(201)
      .then(({ body: { comment } }) => {
          expect(comment).toHaveProperty("comment_id")
          expect(comment).toHaveProperty("votes")
          expect(comment).toHaveProperty("created_at")
          expect(comment).toHaveProperty("author")
          expect(comment).toHaveProperty("body")
          expect(comment).toHaveProperty("article_id", 3)
      })
  })
  test("404: responds with an error message when passed id not present in the articles table", () => {
    return request(app)
      .post("/api/articles/10000/comments")
      .send({
        username : "icellusedkars",
        body : "great stuff"
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Not Found");
      });
  });
  test("400: responds with an error message if id passed is not passed a number", () => {
    return request(app)
      .post("/api/articles/notANumber/comments")
      .send({
        username : "rogersop",
        body : "I love news!"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
  test("404: responds with an error message if passed a username that does not exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username : "notAUsername",
        body: "wish I could comment here..."
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Not Found");
      });
  });
  test("400: responds with an error message if passed body contains the correct fields but incorrect values for the fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username : 4,
        body: "this could use more numbers"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
  test("400: responds with an error message if passed body does not contain the correct fields", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        body: "this could use more numbers",
        otherkey: "othervalue"

      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test('200: Responds with an object containing the updated article data if given a valid article id and body', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: -4
      })
      .expect(200)
      .then(({ body: { article } }) => {
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("topic")
          expect(article).toHaveProperty("author")
          expect(article).toHaveProperty("body")
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes", 96)
          expect(article).toHaveProperty("article_id", 1)
      })
  })
  test("404: responds with an error message when passed id not present in the articles table", () => {
    return request(app)
      .patch("/api/articles/10000")
      .send({
        inc_votes: -10
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Not Found");
      });
  });
  test("400: responds with an error message if id passed is not a number", () => {
    return request(app)
      .patch("/api/articles/notANumber")
      .send({
        inc_votes: 403
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
  test("400: responds with an error message if passed body contains the correct fields but incorrect values for the fields", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "nine"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
  test("400: responds with an error message if passed body does not contain the correct fields", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({
        username: "greggoryt",
        otherkey: "othervalue"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('204: responds with nothing if comment successfully deleted', () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 3`)
        .then(({ rows }) => {
          expect(rows).toEqual([])
        })
      })
  });
  test("404: responds with an error message when passed id not present in the comments table", () => {
    return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Not Found");
      });
  });
  test("400: responds with an error message when passed id is not a number", () => {
    return request(app)
      .delete("/api/comments/notANumber")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe('GET /api/users', () => {
  test('200: responds with an array containing correct data on all users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body : { users } }) => {
      expect(users.length).toBeGreaterThan(0)
      users.forEach((user) => {
        expect(user).toHaveProperty("username")
        expect(user).toHaveProperty("name")
        expect(user).toHaveProperty("avatar_url")
      })
    })
  }); 
});