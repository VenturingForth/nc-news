const db = require("../db/connection.js");

module.exports.fetchArticles = () => {
    return db.query(`
        SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, (
            SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.author, articles.title, articles.article_id
        ORDER BY created_at DESC;
        `).
    then(({rows}) => {
        return rows;
    })
}

module.exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Article ID not found"})
        }
        return rows[0];
    })
}