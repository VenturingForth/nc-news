const { fetchUsers } = require("../models/users-models.js")

module.exports.getUsers = (req, res, next) => {
    return fetchUsers().then((users) => {
        res.status(200).send({users});
    }).catch(next);
}