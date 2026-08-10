const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getModules, toggleModule, getCategories, activatePremium, deactivatePremium } = require('../controllers/moduleController');

router.get('/', auth, getModules);
router.post('/:moduleId/toggle', auth, toggleModule);
router.post('/:moduleId/activate-premium', auth, activatePremium);
router.post('/:moduleId/deactivate-premium', auth, deactivatePremium);
router.get('/:moduleId/categories', auth, getCategories);

module.exports = router;
