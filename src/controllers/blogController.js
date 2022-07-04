const BlogModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")
const { findOneAndUpdate } = require("../models/blogModel")

// const moment = require('moment');

const valid = function (value) {
    if (typeof value !== "string" || value.trim().length == 0) { return false }
    return true
}

// ====================================create Blog======================================================================

const createBlog = async function (req, res) {
    try {
        let blogData = req.body

        // checks if the req.body is empty

        if (Object.keys(blogData).length == 0) res.status(400).send({ status: false, msg: "Enter the blog details" })

        if (!blogData.title) { return res.status(400).send({ status: false, message: "title is required" }) }

        if (!blogData.body) { return res.status(400).send({ status: false, message: "body is required" }) }

        if (!blogData.authorId) { return res.status(400).send({ status: false, message: "authorid is required" }) }

        if (!blogData.category) { return res.status(400).send({ status: false, message: "category is required" }) }


        if (!valid(blogData.title)) { return res.status(400).send({ status: false, message: "title is not valid" }) }

        if (!valid(blogData.body)) { return res.status(400).send({ status: false, message: "body is not valid" }) }

        if (!valid(blogData.category)) { return res.status(400).send({ status: false, message: "category is not valid" }) }

        if (blogData.tags) {
            for (let i = 0; i < blogData.tags.length; i++) {
                if (!valid(blogData.tags[i])) { return res.status(400).send({ status: false, message: "tags is not valid" }) }

            }
        }
        if (blogData.subcategory) {
            for (let i = 0; i < blogData.subcategory.length; i++) {
                if (!valid(blogData.subcategory[i])) { return res.status(400).send({ status: false, message: "subcategory is not valid" }) }
            }
        }

        let Id = blogData.authorId

        let author = await AuthorModel.findOne({ _id: Id })

        if (author == null) { { return res.status(400).send({ status: false, message: "author is not persent" }) } }
        let blogCreated = await BlogModel.create(blogData)
        res.status(201).send({ status: true, data: blogCreated })
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

// ==============================================get Blog================================================================
const blogList = async function (req, res) {

    try {
        let id = req.query.authorId
        let category = req.query.category
        let tag = req.query.tags
        let sub = req.query.subcategory
        const isquery = req.query

        let list = await BlogModel.find({ isDeleted: false, isPublished: true })

        if (!list.length) return res.status(404).send({ status: false, msg: "blog not found" })

        if (Object.keys(isquery).length == 0) return res.status(400).send({ status: false, msg: "Enter the details of the blog that you are looking for" })

        let bloglist = await BlogModel.find({ isDeleted: false, isPublished: true, $or: [{ authorId: id }, { category: category }, { tags: tag }, { subcategory: sub }] })

        if (bloglist.length == 0) {

            res.status(404).send({ status: false, msg: "No such Blogs found" })
        }

        else { res.status(200).send({ status: true, data: bloglist }) }

    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

// ======================================Update Blog===================================================================

const updateBlog = async function (req, res) {
    try {

        let blogData = req.body
        let id = req.params.blogId

        if (Object.keys(blogData).length == 0) return res.status(400).send({ status: false, msg: "Enter the data that you want to update" })

        let list1 = await BlogModel.findOne({ _id: id, isDeleted: false })
        if (list1 === null) { return res.status(404).send({ status: false, msg: "blog not found" }) }

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
            for (let i = 0; i < blogData.tags.length; i++) {
                if (!valid(blogData.tags[i])) { return res.status(400).send({ status: false, message: "tags is not valid" }) }

            }
        }
        let list = await BlogModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $push: { tags: blogData.tags, subcategory: blogData.subcategory } })

        let finalList = await BlogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
            title: blogData.title,
            body: blogData.body,
            publishedAt: new Date(),
            isPublished: true

        }, { new: true })
        if (list == null) {
            res.status(404).send({ status: false, msg: "blog not found" })
        }
        else { res.status(200).send({ status: true, data: finalList }) }

    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

// =======================================Deleting blog by ID=============================================================
const deleteBlogById = async function (req, res) {

    try {
        let blogId = req.params.blogId;

        let blog = await BlogModel.findOne({ _id: blogId, isDeleted: false })

        if (blog == null) {
            return res.status(400).send({ msg: 'no such blog exists' });
        }

        let deleteUser = await BlogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        res.status(200).send({ status: true, data: "deletion succesfull" })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}
// ==============================================delete blog by querying=======================================================================
const deleteByQuerying = async function (req, res) {
    try {
        const data = req.query
        const category = req.query.category
        const authorId = req.query.authorId
        const tagName = req.query.tags
        const subcategory = req.query.subcategory
        const isPublished = req.query.isPublished

        //check if the query field is empty
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Enter the details of blog that you would like to delete" })

        //finding document using query params
        const ToBeDeleted = await BlogModel.findOneAndUpdate({ isDeleted: false, $or: [{ category: category }, { authorId: authorId }, { tags: tagName }, { subcategory: subcategory },{isPublished:isPublished}] }, { $set: { isDeleted: true, deletedAt: new Date() } })

        if (ToBeDeleted == null) return res.status(404).send({ status: false, msg: "Blog not found" })

        res.status(200).send({ status: true, msg: "deletion successfull" })
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}



module.exports = { createBlog, blogList, updateBlog, deleteBlogById, deleteByQuerying }
