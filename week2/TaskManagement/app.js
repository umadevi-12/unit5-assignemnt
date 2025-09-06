const Task = require('./models/Task');


app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  const { status, dueDate } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

  try {
    const tasks = await Task.find(filter);
    res.json(tasks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
