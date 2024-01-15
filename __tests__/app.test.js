const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api", () => {
    describe("/topics", () => {
        it("200: Should respond with an array of topics with slugs and descriptions", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((res) => {
                res.body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty(slug, expect.any(String));
                    expect(topic).toHaveProperty(description, expect.any(String));
                })
            })
        })
    })
})