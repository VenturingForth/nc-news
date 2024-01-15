const { fetchArticleById } = require("../models/articles-models.js")

module.exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleById(article_id).then((article) => {
        res.status(200).send({article: article})
    }).catch(next);
}