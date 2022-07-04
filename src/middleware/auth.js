const jwt = require("jsonwebtoken")
const BlogModel = require("../models/blogModel")



const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
       
        if (!token) {
            return res.status(404).send({ status: false, msg: 'Token is Mandatory' })
        }
        try {
            let decodedToken = jwt.verify(token, "functionUp")
        }
        catch (error) {
            return res.status(400).send({ status: false, msg: "invalid token" })
        }
        next()
    }
    catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }

}


const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "functionUp")
        let decodedAuthor = decodedToken.userId

        let blogId = req.params.blogId

        //get author Id by searching in database 
        getAuthorId = await BlogModel.findById(blogId)

        if (getAuthorId == null) return res.status(404).send({ status: false, msg: "Blog not found" })

        let author = getAuthorId.authorId.toString()

        if (decodedAuthor != author) return res.status(400).send({ status: false, msg: "You are not authorised to perform this action" })
        next();

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}




const deleteByquerying = async function (req, res, next) {
    try {
        let authorId = req.query.authorId
        let category = req.query.category
        let tagName = req.query.tags
        let subcategory = req.query.subcategory
        let isPublished = req.query.isPublished

        let requestBody = req.query

        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "functionUp")
        let decodedAuthor = decodedToken.userId
        
        // checks if query field is empty
        if (Object.keys(requestBody).length == 0) { return res.status(400).send({ status: false, msg: "Enter the details of the blog that you would like to delete" }) }

        // if authorId is present in the query field
        if (authorId) {

            if (decodedAuthor == authorId) { return next() }

            else { return res.status(400).send({ status: false, msg: "You are not authorized to perform this action" }) }
        }
        else {

            const data = await BlogModel.find({ $or: [{ category: category }, { tags: tagName }, { subcategory: subcategory }, { isPublished: isPublished }] }).select({ authorId: 1, _id: 0 })
            for (let i = 0; i < data.length; i++) {
                if (data[i].authorId == decodedAuthor) {
                    return next()
                }
            }
          res.status(400).send({ status: false, msg: "You are not authorized to perform this action" })
        }

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }

}

module.exports.authentication = authentication;
module.exports.authorization = authorization
module.exports.deleteByquerying = deleteByquerying