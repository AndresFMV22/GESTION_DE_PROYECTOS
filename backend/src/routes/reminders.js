const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getReminders, createReminder, updateReminder, deleteReminder, getUpcomingSummary } = require('../controllers/reminderController');

router.get('/', auth, getReminders);
router.get('/upcoming', auth, getUpcomingSummary);
router.post('/', auth, createReminder);
router.put('/:id', auth, updateReminder);
router.delete('/:id', auth, deleteReminder);

module.exports = router;
