const express = require('express');
const userController = require("../controllers/user");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({status: true});
})

module.exports = router;
