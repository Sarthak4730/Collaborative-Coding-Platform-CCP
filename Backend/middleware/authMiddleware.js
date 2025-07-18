import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if( !authHeader || !authHeader.startsWith("Bearer ") ) return res.status(401).json( { message: "Not Authorized, invalid token" } );

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json( { message: "Token expired or invalid" } );
    }
};

export default protect;