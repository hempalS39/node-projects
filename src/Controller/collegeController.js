const collegeModel = require("../Model/collegeModel")
const isBodyExist = function (data) {
    return Object.keys(data).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};


const regex = /\d/;
const isVerifyString = function (string) {
    return regex.test(string)
};

const createCollege = async function (req, res) {
    try {

        let data = req.body
        if (!isBodyExist(data)) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }


        if (!data.name) return res.status(400).send({ status: false, msg: "name is required" })
        if (!data.fullName) return res.status(400).send({ status: false, msg: "fullName is required" })
        if (!data.logoLink) return res.status(400).send({ status: false, msg: "logoLink is required" })


        if (!isValid(data.name)) return res.status(400).send({ status: false, message: "invalid name" })
        if (!isValid(data.fullName)) return res.status(400).send({ status: false, message: "invalid fullname " })
        if (!isValid(data.logoLink)) return res.status(400).send({ status: false, message: "invalid link" })


        if (isVerifyString(data.name)) return res.status(400).send({ status: false, message: "name can not contain digits" })
        if (isVerifyString(data.fullName)) return res.status(400).send({ status: false, message: "fullName can not contain digits" })

        
        if(await collegeModel.findOne({name:data.name})){
            return res.status(400).send({status:false,message:`${data.name} already exists.`})
        }
        let college = await collegeModel.create(data)
        res.status(201).send({ status: true, data: college })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createCollege = createCollege