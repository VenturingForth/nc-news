const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const endpoints = require("../endpoints.json")

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("General API error handling", () => {
    test("404: Unavailable Route - Should display custom error message if no API path found", () => {
        return request(app)
        .get('/api/invalid')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Invalid Endpoint");
        })
    })
})

describe("GET /api", () => {
    test("200: Should respond with a JSON object detailing all available endpoints", () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
            expect(res.body).toMatchObject(endpoints);
        })
    })
    describe("/topics", () => {
        test("200: Should respond with an array of topics with slugs and descriptions", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((res) => {
                expect(res.body.topics.length).not.toBe(0);
                return res.body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String));
                    expect(topic).toHaveProperty("description", expect.any(String));
                })
            })
        })
    })
    describe("/articles", () => {
        describe("/:article_id", () => {
            test("200: Should retrieve an article by id", () => {
                return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body.article).toHaveProperty("author", expect.any(String));
                    expect(res.body.article).toHaveProperty("title", expect.any(String));
                    expect(res.body.article).toHaveProperty("article_id", expect.any(Number));
                    expect(res.body.article).toHaveProperty("body", expect.any(String));
                    expect(res.body.article).toHaveProperty("topic", expect.any(String));
                    expect(res.body.article).toHaveProperty("created_at", expect.any(String));
                    expect(res.body.article).toHaveProperty("votes", expect.any(Number));
                    expect(res.body.article).toHaveProperty("article_img_url", expect.any(String));
                })
            })
        })
    })
})