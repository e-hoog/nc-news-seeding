const endpointsJson = require("../endpoints.json");
const request = require("supertest")
const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("ALL /notARoute", () => {
  test("404: Responds with an error message if path given is not a route", () => {
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
  test("200: Responds with an array containing data on all topics", () => {
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