const express = require('express');
const router = express.Router();
const { addUser, listUsers, addUserWithFail, updateUser } = require('../controllers/userController');

router.get('/', listUsers);
router.post('/', addUser);
router.post('/test-transaction', addUserWithFail);
router.post('/', addUser);
router.put('/users/:id', updateUser);
module.exports = router;