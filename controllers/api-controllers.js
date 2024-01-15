const { fetchApi } = require("../models/api-models.js");

module.exports.getApi = (req, res, next) => {
    const endpoints = fetchApi();
    res.status(200).send(endpoints);
}