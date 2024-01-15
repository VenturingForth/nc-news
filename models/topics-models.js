const db = require("../db/connection.js");

module.exports.selectTopics = (() => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics.rows;
    });
})