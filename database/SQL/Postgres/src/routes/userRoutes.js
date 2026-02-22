const express = require('express');
const router = express.Router();
const { listUsers, addUser } = require('../controllers/userController');

router.get('/', listUsers);
router.post('/add', addUser);

module.exports = router;