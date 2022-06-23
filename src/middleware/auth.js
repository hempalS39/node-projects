const jwt = require("jsonwebtoken")



const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) {
           return res.status(404).send({ status: false, msg: 'Token Mandatory' })
        }
        let decodedToken = jwt.verify(token, "functionUp")
        if(!decodedToken){
           return res.status(400).send({status:false, msg: "token is invalid"})
        }
        next()
    }
    catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }

}


const authorization = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let decodedToken = jwt.verify(token, "functionUp")

        let data2 = decodedToken.userId;
        console.log(data2)
        
        let data1 = req.headers["author_id"]
            console.log(data1)
            if(data1 !==data2){
                return res.status(401).send({ status: false, msg: 'Unauthorized "Cannot access Other"s Data' })
                }
        
        

        next()
    }

    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}
module.exports.authentication = authentication;
module.exports.authorization = authorization

