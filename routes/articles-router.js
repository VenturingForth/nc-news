const articlesRouter = require('express').Router();
const { getArticles, getArticleById, getArticleComments, postArticleComment, patchArticle } = require('../controllers/articles-controllers.js');

articlesRouter.route("/")
    .get(getArticles)
articlesRouter.route("/:article_id")
    .get(getArticleById)
    .patch(patchArticle)
articlesRouter.route("/:article_id/comments")
    .get(getArticleComments)
    .post(postArticleComment)

module.exports = { articlesRouter }
