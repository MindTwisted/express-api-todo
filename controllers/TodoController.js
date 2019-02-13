const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');
const View = require('../views/index');
const db = require('../models/index');
const Todo = db.Todo;

const TodoController = {
    index(req, res, next) {
        const user = req.user;

        Todo.findAll({
                where: {
                    userId: user.id
                }
            })
            .then(todos => {
                const data = {
                    todos
                };

                res.status(200).send(View.generate(null, data));
            })
            .catch(error => {
                const text = "Unexpected error occurred. Please try again later.";

                res.status(500).send(View.generate(text, null, false));
            });
    },
    show(req, res, next) {
        const id = req.params.id;
        const user = req.user;
    
        Todo.findOne({
                where: {
                    id,
                    userId: user.id
                }
            })
            .then(todo => {
                if (!todo) {
                    const text = `Todo with id ${id} doesn't exist.`;

                    return res.status(404).send(View.generate(text, null, false));
                }

                const data = {
                    todo
                };

                res.status(200).send(View.generate(null, data));
            })
            .catch(error => {
                const text = "Unexpected error occurred. Please try again later.";

                res.status(500).send(View.generate(text, null, false));
            });
    },
    store(req, res, next) {
        const body = req.body;
        const user = req.user;
    
        Todo.build({
                title: body.title,
                description: body.description,
                UserId: user.id
            })
            .validate()
            .then(todo => {
                todo.save()
                    .then(todo => {
                        const text = "Todo was successfully added.";
                        const data = {
                            todo
                        };

                        res.status(200).send(View.generate(text, data));
                    })
                    .catch(error => {
                        const text = "Unexpected error occurred. Please try again later.";

                        res.status(500).send(View.generate(text, null, false));
                    });
            })
            .catch(error => {
                const text = "Validation failed.";
                const data = {
                    errors: ValidationErrorsSerializer.serialize(error.errors)
                };

                res.status(422).send(View.generate(text, data, false));
            });
    },
    destroy(req, res, next) {
        const id = req.params.id;
        const user = req.user;

        Todo.findOne({
                where: {
                    id,
                    UserId: user.id
                }
            })
            .then(todo => {
                if (!todo) {
                    const text = `Todo with id ${id} doesn't exist.`;

                    return res.status(404).send(View.generate(text, null, false));
                }

                return todo.destroy()
                    .then(() => {
                        const text = `Todo with id ${id} was successfully deleted.`;
        
                        res.status(200).send(View.generate(text));
                    });
            })
            .catch(error => {
                const text = "Unexpected error occurred. Please try again later.";

                res.status(500).send(View.generate(text, null, false));
            });
    }
};

module.exports = TodoController;