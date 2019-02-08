const db = require('../models/index');
const Todo = require('../models/todo')(db.sequelize, db.Sequelize);
const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');
const View = require('../views/index');

const TodoController = {
    index(req, res, next) {
        Todo.findAll()
            .then(todos => {
                const data = {
                    todos
                };

                res.status(200).send(View.generate(null, data));
            });
    },
    show(req, res, next) {
        const id = req.params.id;
    
        Todo.findById(id)
            .then(todo => {
                if (!todo) {
                    const text = `Todo with id ${id} doesn't exist.`;

                    res.status(404).send(View.generate(text, null, false));

                    return;
                }

                const data = {
                    todo
                };

                res.status(200).send(View.generate(null, data));
            });
    },
    store(req, res, next) {
        const body = req.body;
    
        Todo.create({
                title: body.title,
                description: body.description
            })
            .then(todo => {
                const text = "Todo was successfully added.";
                const data = {
                    todo
                };

                res.status(200).send(View.generate(text, data));
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
    
        Todo.findById(id)
            .then(todo => {
                if (!todo) {
                    return Promise.reject();
                }

                return todo.destroy();
            })
            .then(() => {
                const text = `Todo with id ${id} was successfully deleted.`;

                res.status(200).send(View.generate(text));
            })
            .catch(error => {
                const text = `Todo with id ${id} doesn't exist.`;

                res.status(404).send(View.generate(text, null, false));
            });
    }
};

module.exports = TodoController;