const { fetchArticleById, 
        fetchArticles,
        fetchArticleComments } = require("../models/articles-models.js")

module.exports.getArticles = (req, res, next) => {
    return fetchArticles().then((articles) => {
        res.status(200).send({articles});
    }).catch(next);
}

module.exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch(next);
}

module.exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleComments(article_id).then((comments) => {
        res.status(200).send({comments});
    }).catch(next);
}