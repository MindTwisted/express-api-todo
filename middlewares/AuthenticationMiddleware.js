const moment = require('moment');
const db = require('../models/index');
const Token = db.Token;
const User = db.User;

module.exports = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return next();
    }

    const token = authorizationHeader.slice(7);

    if (!token) {
        return next();
    }

    Token.findOne({
            where: {token},
            include: [
                {
                    model: User
                }
            ]
        })
        .then(token => {
            if (!token) {
                return next();
            }

            const now = moment();
            const expiredAt = moment(token.expiredAt);

            if (!expiredAt.isSameOrAfter(now)) {
                return next();
            }

            req.user = token.User;

            return next();
        })
        .catch(next);
};