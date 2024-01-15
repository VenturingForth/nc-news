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
})