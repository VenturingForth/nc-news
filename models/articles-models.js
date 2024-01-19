const db = require("../db/connection.js");

module.exports.fetchArticles = (topic = null, sort_by="created_at", order = "desc") => {
    const queryValues = [];
    const validSortCriteria = [ 'title', 'topic', 'author', 'created_at', 'votes' ];
    const validOrderCriteria = [ 'asc', 'desc' ]
    if(!validSortCriteria.includes(sort_by)){
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    if(!validOrderCriteria.includes(order)){
        order = 'desc';
    }
    let queryStr = `
        SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, (
            SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `

    if(topic){
        queryStr += ` WHERE topic = $1`;
        queryValues.push(topic);
    }

    queryStr += ` GROUP BY articles.author, articles.title, articles.article_id ORDER BY ${sort_by} ${order};`
    
    return db.query(queryStr, queryValues).then(({rows}) => {
        return rows;
    })
}

module.exports.fetchArticleById = (article_id) => {
    return db.query(`
    SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url,
    (SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.author, articles.title, articles.article_id;`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Article ID not found"});
        }
        return rows[0];
    })
}

module.exports.fetchArticleComments = (article_id) => {
    return db.query(`
        SELECT * FROM comments 
        WHERE article_id = $1
        ORDER BY created_at DESC;
        `, [article_id])
        .then(({rows}) => {
            return rows;
        })
}

module.exports.createArticleComment = (article_id, comment) => {
    queryArray = [comment.body, article_id, comment.username];
    return db.query(`
        INSERT INTO comments
        (body, article_id, author)
        VALUES
        ($1, $2, $3)
        RETURNING *;`, queryArray)
    .then(({rows}) => {
        return rows[0];
    })
}

module.exports.updateArticle = (article_id, inc_votes) => {
    queryArray = [inc_votes, article_id];
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
        `, queryArray)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article ID not found"});
        }
        return rows[0];
    })
}