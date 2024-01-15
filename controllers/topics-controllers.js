const { selectTopics } = require("../models/topics-models.js")

module.exports.getTopics = (req, res, next) => {
    return selectTopics().then((topics) => {
        res.status(200).send(topics.rows);
    })
    .catch(next);
}