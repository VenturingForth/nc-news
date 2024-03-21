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
        test("200: Articles should be able to sort by any valid query", () => {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body}) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("author", { descending : true })
            })
        })
        test("200: Articles should be able to sort ascending or descending", () => {
            return request(app)
            .get('/api/articles?sort_by=title&order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("title");
            })
        })
        test("200: Articles should return default sorting order and criteria if given invalid order.", () => {
            return request(app)
            .get('/api/articles?order=ascending')
            .then(({body}) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy("created_at", { descending:true })
            })
        })
        test("400: Should return 'Bad request' if given an invalid sort query.", () => {
            return request(app)
            .get('/api/articles?sort_by=invalid')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request");
            })
        })
        describe("?topic", () => {
            test("200: Should retrieve an array of article objects filtered by topic with the necessary properties when queried.", () => {
                return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(12);
                    body.articles.forEach((article) => {
                        expect(article.topic).toBe("mitch");
                    })
                })
            })
            test("200: Should retrieve an empty array if topic is in database, but is not associated with the article.", () => {
                return request(app)
                .get('/api/articles?topic=paper')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(0);
                })
            })
            test("404: Should return 'Topic not found' if topic is not in the database.", () => {
                return request(app)
                .get('/api/articles?topic=joshua')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Topic not found");
                })
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
            test("200: Should retrieve an array of all article objects with the necessary properties (now including comment_count!)", () => {
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
                    expect(body.article).toHaveProperty("comment_count", expect.any(Number));
                    expect(body.article.comment_count).toBe(11);
                })
            })
            describe("/comments", () => {
                test("200: Comments should be retrieved with the necessary properties in an array of objects", () => {
                    return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({body}) => {
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
                test("400: Should return 'Bad request' using existing error handles if given invalid article_id", () => {
                    return request(app)
                    .get('/api/articles/invalid_id/comments')
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("Bad request");
                    })
                })
            })
        })
    })
    describe("/users", () => {
        test("200: Should retrieve an array of all users with the necessary properties", () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body.users.length).toBe(4);
                body.users.forEach((user) => {
                    expect(user).toHaveProperty("username", expect.any(String));
                    expect(user).toHaveProperty("name", expect.any(String));
                    expect(user).toHaveProperty("avatar_url", expect.any(String));
                })
            })
        })
        describe("/:username", () => {
            test("200: Should retrieve a user object with the necessary properties", () => {
                return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({body}) => {
                    expect(body.user.username).toBe("butter_bridge");
                    expect(body.user).toHaveProperty("username", expect.any(String));
                    expect(body.user).toHaveProperty("avatar_url", expect.any(String));
                    expect(body.user).toHaveProperty("name", expect.any(String));
                })
            })
            test("404: Should return 'Username not found' if given non-existent username", () => {
                return request(app)
                .get('/api/users/freezypop')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Username not found", expect.any(String));
                })
            })
        })
    })
})

describe("POST /api", () => {
    describe("/articles", () => {
        describe("/:article_id", () => {
            describe("/comments", () => {
                test("201: Should create a new post with test comment, and return the posted comment.", () => {
                    const comment = {
                        username: "butter_bridge",
                        body: "I really miss chocolate Paddlepops, and they only cost 50c when I was a kid."
                    }
                    return request(app)
                    .post('/api/articles/3/comments')
                    .set('Content-Type', 'application/json')
                    .send({ comment })
                    .expect(201)
                    .then(({body}) => {
                        expect(body.comment.author).toBe(comment.username);
                        expect(body.comment.body).toBe(comment.body);
                        expect(body.comment.article_id).toBe(3);
                        expect(body.comment.votes).toBe(0);
                        expect(body.comment).toHaveProperty("comment_id", expect.any(Number));
                        expect(body.comment).toHaveProperty("created_at", expect.any(String));
                    })
                })
                test("404: Should return \"Article ID not found\" if article ID doesn't exist.", () => {
                    const comment = {
                        username: "butter_bridge",
                        body: "I really miss chocolate Paddlepops, and they only cost 50c when I was a kid."
                    }
                    return request(app)
                    .post('/api/articles/999/comments')
                    .set('Content-Type', 'application/json')
                    .send({ comment })
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("Article ID not found");
                    })
                })
                test("400: Should return \"Bad request\" using existing error handles if given invalid id.", () => {
                    const comment = {
                        username: "butter_bridge",
                        body: "I really miss chocolate Paddlepops, and they only cost 50c when I was a kid."
                    }
                    return request(app)
                    .post('/api/articles/invalid_id/comments')
                    .set('Content-Type', 'application/json')
                    .send({ comment })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("Bad request");
                    })
                })
                test("400: Should return \"Bad request\" using existing error handles if comment data types are incorrect.", () => {
                    const comment = {
                        username: "butter_bridge",
                        body: 12345
                    }
                    return request(app)
                    .post('/api/articles/invalid_id/comments')
                    .set('Content-Type', 'application/json')
                    .send({ comment })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("Bad request");
                    })
                })
                test("404: Should return \"Username not found\" if username doesn't exist in database.", () => {
                    const comment = {
                        username: "freezypop",
                        body: "This comment will never land"
                    }
                    return request(app)
                    .post('/api/articles/3/comments')
                    .set('Content-Type', 'application/json')
                    .send({ comment })
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("Username not found");
                    })
                })
            })
        })
    })
})

describe("PATCH /api", () => {
    describe("/articles", () => {
        describe("/:article_id", () => {
            test("200: Should increment or decrement an article's vote property accordingly, returning the updated article.", () => {
                return request(app)
                .patch('/api/articles/1')
                .set('Content-Type', 'application/json')
                .send({ inc_votes : -10 })
                .expect(200)
                .then(({body}) => {
                    expect(body.article.article_id).toBe(1);
                    expect(body.article.votes).toBe(90);
                    expect(body.article).toHaveProperty("title", expect.any(String));
                    expect(body.article).toHaveProperty("topic", expect.any(String));
                    expect(body.article).toHaveProperty("author", expect.any(String));
                    expect(body.article).toHaveProperty("body", expect.any(String));
                    expect(body.article).toHaveProperty("created_at", expect.any(String));
                    expect(body.article).toHaveProperty("article_img_url", expect.any(String))
                })
            })
            test("404: 'Article ID not found' should be returned for valid non-existent article ID", () => {
                return request(app)
                .patch('/api/articles/999')
                .set('Content-Type', 'application/json')
                .send({ inc_votes : 10 })
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Article ID not found");
                })
            })
            test("400: Bad article ID should be handled by existing error handlers.", () => {
                return request(app)
                .patch('/api/articles/invalid_id')
                .set('Content-Type', 'application/json')
                .send({ inc_votes : 10 })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request");
                })
            })
            test("400: Invalid data type for inc_votes should be handled by existing error handlers.", () => {
                return request(app)
                .patch('/api/articles/1')
                .set('Content-Type', 'application/json')
                .send({ inc_votes : "invalid data type" })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request");
                })
            })
        })
    })
    describe("/comments", () => {
        describe("/:comment_id", () => {
            test("200: Should increment or decrement a comment's vote property acordingly, returning the updated comment", () => {
                return request(app)
                .patch('/api/comments/1')
                .set('Content-Type', 'application/json')
                .send({ inc_votes: 10 })
                .expect(200)
                .then(({body}) => {
                    expect(body.comment.comment_id).toBe(1);
                    expect(body.comment.votes).toBe(26);
                    expect(body.comment).toHaveProperty("body", expect.any(String));
                    expect(body.comment).toHaveProperty("article_id", expect.any(Number));
                    expect(body.comment).toHaveProperty("author", expect.any(String));
                    expect(body.comment).toHaveProperty("created_at", expect.any(String));
                })
            })
            test("400: Bad request should be handled by existing errors for invalid comment_id", () => {
                return request(app)
                .patch('/api/comments/one')
                .set('Content-Type', 'application/json')
                .send({ inc_votes: 10 })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Bad request');
                })
            })
            test("404: Should return 'Comment ID not found' if given valid but nonexistent comment_id", () => {
                return request(app)
                .patch('/api/comments/999')
                .set('Content-Type', 'application/json')
                .send({ inc_votes: 10 })
                .expect(404)
                .then(({body}) => {
                    console.log(body);
                    expect(body.msg).toBe('Comment ID not found');
                })
            })
        })
    })
})

describe("DELETE /api", () => {
    describe("/comments", () => {
        describe("/:comment_id", () => {
            test("204: Successfully delete a comment by comment id, returning no content.", () => {
                return request(app)
                .delete("/api/comments/1")
                .expect(204)
                .then(({body}) => {
                    expect(Object.keys(body).length).toBe(0);
                })
            })
            test("400: Bad request should  be handled by existing errors for invalid comment_id", () => {
                return request(app)
                .delete("/api/comments/invalid_id")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request")
                })
            })
            test("404: Should return 'Comment ID not found' for valid non-existent comment_id", () => {
                return request(app)
                .delete("/api/comments/999")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Comment ID not found");
                })
            })
        })
    })
})