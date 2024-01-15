const db = require("../db/connection.js");

module.exports.selectTopics = (() => {
    return db.query(`SELECT * FROM topics`);
})