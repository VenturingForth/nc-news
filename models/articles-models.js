const db = require("../db/connection.js");

module.exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((article) => {
        console.log(article.rows[0]);
        return article.rows[0];
    })
}