const jwt = require('jsonwebtoken');
const JWT_SECRET = "Raviisagoodcoder$@"

const fetchuser = (req,res,next) => {
    // Get the user from jwt token and add user id to req object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send("Please authenticate with a valid token");
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).send("Please authenticate with a valid token");
    }
}

module.exports = fetchuser;