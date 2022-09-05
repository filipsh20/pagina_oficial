const mongoose = require('mongoose');
require('dotenv').config();

const client = mongoose.connect(process.env.URI)
    .then((success) => {console.log("Connected to database"); return success.connection.getClient()})
    .catch((error) => console.log(error));

module.exports = client;
