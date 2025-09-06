const Task = require('../models/task.model');

async function createTask(req, res) {
    try {
        const { title } = req.body;
        const existing = await Task.findOne({ title });
        if (existing) {
            return res.status(409).json({ error: 'Task with this title already exists' });
        }
        const task = new Task(req.body);
        await task.save();
        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function getTasks(req, res) {
    try {
        const { priority, isCompleted } = req.query;
        const filter = {};
        if (priority) filter.priority = priority;
        if (isCompleted !== undefined) {
            filter.isCompleted = (String(isCompleted) === 'true');
        }
        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        return res.json(tasks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function updateTask(req, res) {
    try {
        const allowed = ['title', 'priority', 'description', 'isCompleted', 'dueDate'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (updates.title && updates.title !== task.title) {
            const existing = await Task.findOne({ title: updates.title });
            if (existing) return res.status(409).json({ error: 'Another task with this title already exists' });
        }

        Object.assign(task, updates);

        if (updates.isCompleted === true && !task.completionDate) {
            task.completionDate = new Date();
        }
        if (updates.isCompleted === false) {
            task.completionDate = undefined;
        }

        await task.save();
        return res.json(task);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

async function getTaskById(req, res) {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        return res.json(task);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function deleteTask(req, res) {
    try {
        const { priority } = req.query;
        if (!priority) {
            return res.status(400).json({ error: 'Provide priority query param to delete tasks' });
        }
        const result = await Task.deleteMany({ priority });
        return res.json({ deletedCount: result.deletedCount });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    getTaskById,
    deleteTask
};
