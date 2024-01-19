const { checkArticleIdExists,
        checkTopicExists } = require("../utils.js");
const { fetchArticleById, 
        fetchArticles,
        fetchArticleComments,
        createArticleComment, 
        updateArticle } = require("../models/articles-models.js")

module.exports.getArticles = (req, res, next) => {
    if (Object.keys(req.query).length !== 0){
        const { topic } = req.query;
        const checkTopicExistsQuery = checkTopicExists(topic);
        const articlesQuery = fetchArticles(topic);
        const queryArray = [articlesQuery, checkTopicExistsQuery];
        return Promise.all(queryArray)
        .then((response) => {
            res.status(200).send({articles:response[0]});
        }).catch(next);
    } else {
        return fetchArticles().then((articles) => {
            res.status(200).send({articles});
        }).catch(next);
    }
}

module.exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch(next);
}

module.exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const checkIdExistsQuery = checkArticleIdExists(article_id);
    const commentsQuery = fetchArticleComments(article_id);
    const queryArray = [commentsQuery, checkIdExistsQuery];
    return Promise.all(queryArray)
    .then((response) => {
        const comments = response[0]
        res.status(200).send({comments});
    }).catch(next);
}

module.exports.postArticleComment = (req, res, next) => {
    const { article_id } = req.params;
    const { comment } = req.body;
    return createArticleComment(article_id, comment).then((postedComment) => {
        res.status(201).send({comment: postedComment});
    }).catch(next);
}

module.exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    return updateArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({ article });
    }).catch(next);
}