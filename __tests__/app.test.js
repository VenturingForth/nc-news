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
        .then(({body}) => {
            expect(body.msg).toBe("Invalid Endpoint");
        })
    })
})

describe("GET /api", () => {
    test("200: Should respond with a JSON object detailing all available endpoints", () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toMatchObject(endpoints);
        })
    })
    describe("/topics", () => {
        test("200: Should respond with an array of topics with slugs and descriptions", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body.topics.length).not.toBe(0);
                return body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String));
                    expect(topic).toHaveProperty("description", expect.any(String));
                })
            })
        })
    })
    describe("/articles", () => {
        test("200: Should retrieve an array of all article objects with only the necessary properties", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles.length).toBe(13);
                return body.articles.forEach((article) => {
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("title",  expect.any(String));
                    expect(article).toHaveProperty("article_id",  expect.any(Number));
                    expect(article).toHaveProperty("topic",  expect.any(String));
                    expect(article).toHaveProperty("created_at",  expect.any(String));
                    expect(article).toHaveProperty("votes",  expect.any(Number));
                    expect(article).toHaveProperty("article_img_url",  expect.any(String));
                    expect(article).toHaveProperty("comment_count",  expect.any(Number));
                    expect(article).not.toHaveProperty("body");
                })
            })
        })
        test("200: Articles retrieved should be sorted by descending order by default.", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', { descending: true });
            })
        })
        describe("/:article_id", () => {
            test("200: Should retrieve an article by id", () => {
                return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({body}) => {
                    expect(body.article.article_id).toBe(1);
                    expect(body.article).toHaveProperty("author", expect.any(String));
                    expect(body.article).toHaveProperty("title", expect.any(String));
                    expect(body.article).toHaveProperty("article_id", expect.any(Number));
                    expect(body.article).toHaveProperty("body", expect.any(String));
                    expect(body.article).toHaveProperty("topic", expect.any(String));
                    expect(body.article).toHaveProperty("created_at", expect.any(String));
                    expect(body.article).toHaveProperty("votes", expect.any(Number));
                    expect(body.article).toHaveProperty("article_img_url", expect.any(String));
                })
            })
            test("404: Should return \"Article ID not found\" if given valid but non-existent ID", () => {
                return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Article ID not found");
                })
            })
            test("400: Should return \"Bad request\" if given an invalid ID.", () => {
                return request(app)
                .get('/api/articles/invalid_id')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request");
                })
            })
            describe("/comments", () => {
                test("200: Comments should be retrieved with the necessary properties in an array of objects", () => {
                    return request(app)
                    .get('/api/articles/3/comments')
                    .expect(200)
                    .then(({body}) => {
                        console.log(body);
                        expect(body.comments.length).toBe(11);
                        body.comments.forEach((comment) => {
                            expect(comment).toHaveProperty("comment_id", expect.any(Number));
                            expect(comment).toHaveProperty("votes", expect.any(Number));
                            expect(comment).toHaveProperty("created_at", expect.any(String));
                            expect(comment).toHaveProperty("author", expect.any(String));
                            expect(comment).toHaveProperty("body", expect.any(String));
                            expect(comment).toHaveProperty("article_id", expect.any(Number));
                        })
                    })
                })
                test("200: Comments should be sorted by most recent first.", () => {
                    return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments).toBeSortedBy("created_at", { descending: true });
                    })
                })
                test("200: Article with no comments should send empty array", () => {
                    return request(app)
                    .get('/api/articles/10/comments')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments.length).toBe(0);
                    })
                })
                test("404: Should return \"Article ID not found\" if given valid but non-existent ID", () => {
                    return request(app)
                    .get('/api/articles/999/comments')
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("Article ID not found")
                    })
                })
            })
        })
    })
})