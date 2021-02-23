const db = require("./settings/db");
const app = require('./settings/app');
require('dotenv').config()

db()
    .then(app)
    .catch(error => console.log(error))


