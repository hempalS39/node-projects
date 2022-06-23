const BlogModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")
const { findOneAndUpdate } = require("../models/blogModel")

// const moment = require('moment');

const valid = function (value) {
    if (typeof value !== "string" || value.trim().length == 0) { return false }
    return true
}


const createBlog = async function (req, res) {
    try {
        let blogData = req.body
        
        if (!blogData.title) { return res.status(400).send({ status: false, message: "title is required" }) }

        if (!blogData.body) { return res.status(400).send({ status: false, message: "body is required" }) }

        if (!blogData.author_Id) { return res.status(400).send({ status: false, message: "authorid is required" }) }

        if (!blogData.category) { return res.status(400).send({ status: false, message: "category is required" }) }


        if (!valid(blogData.title)) { return res.status(400).send({ status: false, message: "title is not valid" }) }

        if (!valid(blogData.body)) { return res.status(400).send({ status: false, message: "body is not valid" }) }

        if (!valid(blogData.category)) { return res.status(400).send({ status: false, message: "category is not valid" }) }
        let Id = blogData.author_Id 
        let author = await AuthorModel.findOne({ _id: Id })

        if (author == null) { { return res.status(400).send({ status: false, message: "author is not persent" }) } }
         let blogCreated = await BlogModel.create(blogData)
        res.status(201).send({ status:true,data: blogCreated })
        }
     catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}


const blogList = async function (req, res) {

    try {
        let id = req.query.author_Id
        let category = req.query.category
        let tag = req.query.tags
        let sub = req.query.subCategory
        let list = await BlogModel.find({ isDeleted: false, isPublished: true })
        if (!list.length) { res.status(404).send({ status: false, msg: "blog not found" }) }

        let bloglist = await BlogModel.find({ isDeleted: false, isPublished: true, $or: [{ author_Id: id }, { category: category }, { tags: tag }, { subCategory: sub }] })

        if (bloglist.length==0) {
            console.log(bloglist.length)
            res.status(404).send({ status: false, msg: "blogs not found" })
        }

        else { res.status(200).send({ status: true, data: bloglist }) }

    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

const updateBlog = async function (req , res) {
    try{
        let id = req.params.blogId

        let list1 = await BlogModel.findOne({ _id: id, isDeleted: false })
        if (list1 == null) { return res.status(404).send({ status: false, msg: "blog not found" }) }

        let blogData = req.body


        if (blogData.body) {
            if (!valid(blogData.body)) { return res.status(400).send({ status: false, message: "body is not valid" }) }
        }
        if (blogData.title) {
            if (!valid(blogData.title)) { return res.status(400).send({ status: false, message: "title is not valid" }) }
        }
        if (blogData.subCategory) {
            for (let i = 0; i < blogData.subCategory.length; i++) {
                if (!valid(blogData.subCategory[i])) { return res.status(400).send({ status: false, message: "subCategory is not valid" }) }

            }
        }   
        if (blogData.tags) {
            for (let i = 0; i < blogData.tags.length; i++){
                if (!valid(blogData.tags[i])) { return res.status(400).send({ status: false, message: "tags is not valid" }) }

            }
        }
        let list = await BlogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
            $addToSet: { tags: { $each: blogData.tags  }, subcategory: { $each: blogData.subCategory  } },
            title: blogData.title,
            body: blogData.body,
            publishedAt: new Date(),
            isPublished: true
        },
            { new: true })
        if (list == null) {
            res.status(404).send({ status: false, msg: "blog not found" })
        }
        else { res.status(200).send({ status: true, data: list }) }

    }
    catch (err) {return res.status(500).send({ status: false, msg: err.message })}

}


const deleteBlogById = async function (req, res) {

    try {
        let blogId = req.params.blogId;
        
        let blog = await BlogModel.findById(blogId)

        if (!blog) {
            return res.status(400).send({ msg: 'no such blog exists' });
        }

        let deleteUser = await BlogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true,isDeletedAt: new Date() }, { new: true })
        res.status(200).send({ status: true, data: "deleted succesfully" })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

const deleteByQuerying = async function (req, res) {
    try{
        const data = req.query

        const category = req.query.category
        const authorId = req.query.authorId
        const tagName = req.query.tags
        const subcategory = req.query.subcategory
        //check if the query field is empty
        if(Object.keys(data).length ==0) return res.status(400).send({status: false, msg: "query field is empty"})

        //finding document using query params
        const ToBeDeleted = await BlogModel.findOneAndUpdate({isDeleted:false, $or:[{category:category},{author_Id:authorId},{tags:tagName},{subcategory:subcategory}]})

        if(ToBeDeleted == null) return res.status(400).send({status:false, msg: "Blog not found"})

        res.status(200).send({status:true, msg: "deleted successfully"})



    }
    catch(err){ return res.status(500).send({ status:false, msg: err.message})}
}



module.exports.createBlog = createBlog
module.exports.blogList = blogList
module.exports.updateBlog = updateBlog
module.exports.deleteBlogById = deleteBlogById
module.exports.deleteByQuerying = deleteByQuerying
