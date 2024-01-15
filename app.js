const express = require('express');
const app = express();

const { getTopics } = require("./controllers/topics-controllers.js");

app.get('/api/topics', getTopics);

//Unavailable Route (404) Error Handling
app.all('*', (req, res) => {
    res.status(404).send({msg: "Invalid Endpoint"});
})

//Internal Error (500) Handling
app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal error: check your code."});
})

module.exports = app;