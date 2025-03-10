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
        //console.log(body);
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

