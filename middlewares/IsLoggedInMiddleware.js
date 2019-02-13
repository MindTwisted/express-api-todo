const View = require('../views/index');

module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send(View.generate("Authentication required.", null, false));
    }
    
    next();
};