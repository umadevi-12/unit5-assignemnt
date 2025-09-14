const express = require('express');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/blogs', authMiddleware, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const blog = new Blog({
            title,
            content,
            tags,
            createdBy: req.user.id
        });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/blogs/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!blog) return res.status(404).json({ message: 'Blog not found or not authorized' });

        const { title, content, tags } = req.body;
        if (title) blog.title = title;
        if (content) blog.content = content;
        if (tags) blog.tags = tags;

        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete('/blogs/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!blog) return res.status(404).json({ message: 'Blog not found or not authorized' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/blogs/stats', authMiddleware, async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const blogsPerUser = await Blog.aggregate([{ $group: { _id: "$createdBy", count: { $sum: 1 } } }]);
        const commonTags = await Blog.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.json({ totalBlogs, blogsPerUser, commonTags });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
