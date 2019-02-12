const View = require('../views/index');

module.exports = (req, res, next) => {
    if (!req.user) {
        res.status(401).send(View.generate("Authentication required.", null, false));

        return;
    }
    
    next();
};