require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.route');
const userJob = require('./cron/userJob');
const logger = require('./logger');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(process.env.PORT, () => {
      logger.info(`Sidecar service running on port ${process.env.PORT}`);
      userJob.start();
    });
  })