const { removeComment } = require("../models/comments-models.js")

module.exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removeComment(comment_id).then((deleted) => {
        res.status(204).send();
    }).catch(next);
}