const View = require('../views/index');
const NotFoundError = require('../errors/NotFoundError');
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
            }).catch(next);
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
                    return next(new NotFoundError(`Todo with id ${id} doesn't exist.`));
                }

                const data = {
                    todo
                };

                res.status(200).send(View.generate(null, data));
            }).catch(next);
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
                    }).catch(next);
            }).catch(next);
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
                    return next(new NotFoundError(`Todo with id ${id} doesn't exist.`));
                }

                return todo.destroy()
                    .then(() => {
                        const text = `Todo with id ${id} was successfully deleted.`;
        
                        res.status(200).send(View.generate(text));
                    }).catch(next);
            }).catch(next);
    }
};

module.exports = TodoController;