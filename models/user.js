const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String
})

module.exports = model("User", UserSchema);
