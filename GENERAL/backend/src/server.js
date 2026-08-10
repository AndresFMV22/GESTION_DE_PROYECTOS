const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const reminderRoutes = require('./routes/reminders');
const { startNotificationService } = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/reminders', reminderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startNotificationService();
});
