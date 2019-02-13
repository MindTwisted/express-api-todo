const View = require('../views/index');
const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');

module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    switch (err.name) {
        case 'SequelizeConnectionRefusedError':
        case 'SequelizeDatabaseError':
            return res.status(500).send(View.generate(
                "Unexpected error occurred. Please try again later.", null, false
            ));
        case 'SequelizeValidationError':
            return res.status(422).send(View.generate(
                "Validation failed.", {
                    errors: ValidationErrorsSerializer.serialize(err.errors)
                }, false
            ));
        case 'NotFoundError':
            return res.status(404).send(View.generate(err.message, null, false));
        default:
            return next(err);
    }
};