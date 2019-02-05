const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');

router.get('/api/todos', TodoController.index);
router.get('/api/todos/:id', TodoController.show);
router.post('/api/todos', TodoController.store);
router.delete('/api/todos/:id', TodoController.destroy);

module.exports = router;