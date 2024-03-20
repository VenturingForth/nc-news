const db = require("../db/connection.js");

module.exports.fetchUsers = () => {
    return db.query(`
    SELECT * FROM users;
    `)
    .then(({rows}) => {
        return rows;
    })
}

module.exports.fetchUserByUsername = (username) => {
    const queryValues = [username]
    return db.query(`
    SELECT * FROM users WHERE username = $1;
    `, queryValues)
    .then(({rows}) => {
        return rows[0];
    })
}