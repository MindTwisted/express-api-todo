const View = require('../views/index');
const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');

module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === 'SequelizeConnectionRefusedError') {
        const text = "Unexpected error occurred. Please try again later.";

        return res.status(500).send(View.generate(text, null, false));
    }

    if (err.name === 'SequelizeValidationError') {
        const text = "Validation failed.";
        const data = {
            errors: ValidationErrorsSerializer.serialize(err.errors)
        };

        return res.status(422).send(View.generate(text, data, false));
    }

    if (err.name === 'NotFoundError') {
        const text = err.message;

        return res.status(404).send(View.generate(text, null, false));
    }

    next(err);
};