const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.use('/api', AuthMiddleware);

router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

router.get('/api/auth', AuthController.me);
router.get('/api/todos', TodoController.index);
router.get('/api/todos/:id', TodoController.show);
router.post('/api/todos', TodoController.store);
router.delete('/api/todos/:id', TodoController.destroy);

module.exports = router;