const jwt = require("express-jwt");
const secret = process.env.JWT_SECRET;
const jsonwebtoken = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.clear()
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log('token', token)
        const userdata = jsonwebtoken.verify(token, secret)
        console.log('user', userdata)
        if (userdata.type === 'AdminProfile' || userdata.type === 'KitchenProfile'|| userdata.type === 'UserProfile') {
            next();
        } else {
            res.status(401).send({
                status: false,
                message: "Unauthorized as Kitchine or Admin",
            });
        }
    } else {
        res.status(401).send({
            status: false,
            message: "Unauthorized as Kitchine or Admin",
        });
    }
}
module.exports = authenticate;