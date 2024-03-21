const db = require("../db/connection.js");

module.exports.removeComment = ((comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1;
        `, [comment_id])
    .then(({rowCount}) => {
        if (rowCount === 0) {
            return Promise.reject({status: 404, msg: "Comment ID not found"});
        }
        return { msg: "Succesful deletion" };
    })
})

module.exports.updateComment = (comment_id, inc_votes) => {
    queryArray = [ inc_votes, comment_id ];
    return db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *
    `, queryArray)
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Comment ID not found"});
        }
        return rows[0];
    })
}