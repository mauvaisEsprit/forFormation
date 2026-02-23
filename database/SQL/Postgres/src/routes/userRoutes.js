const express = require('express');
const router = express.Router();
const { createUserController, listUsers, addUserWithFail, updateUser } = require('../controllers/user.controller');
const { validateSchema } = require('../middlewares/validate');
const { createUserSchema } = require('../schemas/createUser.schema');

router.get('/', listUsers);
router.post('/', validateSchema(createUserSchema), createUserController);
router.post('/test-transaction', addUserWithFail);
router.put('/users/:id',validateSchema(createUserSchema), updateUser);
module.exports = router;