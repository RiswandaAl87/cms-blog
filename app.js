const express = require('express');
const postRoutes = require('./routes/post.routes');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
