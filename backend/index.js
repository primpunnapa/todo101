const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 15000;

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/todos';

app.use(cors());
app.use(express.json());

// Mongoose Schema
const Task = mongoose.model('Task', new mongoose.Schema({
    text: String,
    completed: Boolean
}));

// Routes
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

app.put('/task/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

//connect to MongoDB ans start server only when ready
const connectWithRetry = () => {
    console.log('Trying to connect to MongoDB...');
    mongoose.connect(mongoURL, {
    })
        .then(() => {
            console.log('MongoDB conected');
            app.listen(PORT, () => {
                console.log(`Backend running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('MongoDB connection error. Retrying in 5s...', err.message);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();