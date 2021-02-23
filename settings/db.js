const mongoose = require('mongoose');
const config = require("../config")

const connection_db = async () => {
    const db = await mongoose.connect(config.db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    require("../models");
}

module.exports = connection_db;
