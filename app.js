const express = require('express');
const app = express();

const { getTopics } = require("./controllers/topics-controllers.js")

app.use(express.json());

app.get('/api/topics', getTopics);

//Bad Request (400) Handling

//Internal Error (500) Handling
app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal error: check your code."})
})

module.exports = app;