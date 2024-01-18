const db = require("../db/connection.js");

module.exports.fetchUsers = () => {
    return db.query(`
    SELECT * FROM users;
    `)
    .then(({rows}) => {
        return rows;
    })
}