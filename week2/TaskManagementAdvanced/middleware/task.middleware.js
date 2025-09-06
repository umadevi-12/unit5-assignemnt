

const allowedPriorities = ['low', 'medium', 'high'];

function validateCreate(req, res, next) {
    const { title, description, status, priority } = req.body;

    
    if (!title || !description) {
        return res.status(400).json({ error: "Incomplete Data Received" });
    }

    
    if (!status) req.body.status = "pending";
    if (priority !== undefined) {
        if (typeof priority !== 'string' || !allowedPriorities.includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority. Use exactly: low, medium, or high' });
        }
    }

    next();
}

function validateUpdate(req, res, next) {
   
    if (req.body.priority !== undefined) {
        if (typeof req.body.priority !== 'string' || !allowedPriorities.includes(req.body.priority)) {
            return res.status(400).json({ error: 'Invalid priority. Use exactly: low, medium, or high' });
        }
    }
    next();
}

module.exports = { validateCreate, validateUpdate };
