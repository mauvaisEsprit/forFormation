const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const { ValidationError } = require('./middlewares/errors');
const { ConflictError } = require('./middlewares/errors');
const { NotFoundError } = require('./middlewares/errors');

const app = express();
app.use(express.json());

app.use('/', userRoutes);

// тестовый маршрут, который кидает ошибку
app.get('/test', (req, res, next) => {
  next(new ValidationError("Это ошибка валидации"));
});


app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));