const { removeComment, updateComment } = require("../models/comments-models.js")

module.exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removeComment(comment_id).then((deleted) => {
        res.status(204).send();
    }).catch(next);
}

module.exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    return updateComment(comment_id, inc_votes).then((comment) => {
        res.status(200).send({ comment });
    }).catch(next);
}