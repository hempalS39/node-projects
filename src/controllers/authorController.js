const AuthorModel = require("../models/authorModel")

// const jwt = require("jsonwebtoken")

const valid = function (value) {

    if (typeof value !== "string" || value.trim().length == 0) { return false }
    return true
}


const createAuthor = async function (req, res) {
    try {
        let author = req.body
        
        if (!author.title) { return res.status(400).send({ status: false, message: "title is required" }) }

        if (!author.firstName) { return res.status(400).send({ status: false, message: "author first name is required" }) }

        if (!author.lastName) { return res.status(400).send({ status: false, message: "author last name is required" }) }

        if (!author.email) { return res.status(400).send({ status: false, message: "email is required" }) }

        if (!author.password) { return res.status(400).send({ status: false, message: "password is required" }) }
         
        if (!valid(author.firstName)) { return res.status(400).send({ status: false, message: "author first name is not valid" }) }

        if (!valid(author.lastName)) { return res.status(400).send({ status: false, message: "author last name must is not valid " }) }

        if (!valid(author.password)) { return res.status(400).send({ status: false, message: "password name is not valid" }) }

        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status:true,data: authorCreated })
        }
     catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}




module.exports.createAuthor= createAuthor
