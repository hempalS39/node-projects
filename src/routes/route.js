const express = require('express');
const router = express.Router();
// const AuthorModel= require("../models/authorModel")
const AuthorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/authors", AuthorController.createAuthor  )

router.post("/blogs", BlogController.createBlog)

router.get("/blogs",BlogController.blogList)

router.put("/blogs/:blogId",BlogController.updateBlog)


module.exports = router;