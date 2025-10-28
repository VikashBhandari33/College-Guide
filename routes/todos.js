const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');
const { body, validationResult } = require('express-validator');

// Validation middleware
const todoValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

// Get all todos for current user
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new todo
router.post('/', auth, todoValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const todo = new Todo({
            ...req.body,
            user: req.user._id
        });

        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update todo
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed', 'dueDate', 'priority'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        updates.forEach(update => todo[update] = req.body[update]);
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;