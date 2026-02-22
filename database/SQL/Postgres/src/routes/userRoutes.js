const express = require('express');
const router = express.Router();
const { addUser, listUsers, addUserWithFail } = require('../controllers/userController');

router.get('/', listUsers);
router.post('/', addUser);
router.post('/test-transaction', addUserWithFail);

module.exports = router;