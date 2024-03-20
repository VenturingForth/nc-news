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
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Username not found"});
        } else {
            return rows[0];
        }
    })
}