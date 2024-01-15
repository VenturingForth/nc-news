const app = require("../app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

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
    describe("/topics", () => {
        test("200: Should respond with an array of topics with slugs and descriptions", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((res) => {
                return res.body.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String));
                    expect(topic).toHaveProperty("description", expect.any(String));
                })
            })
        })
    })
})