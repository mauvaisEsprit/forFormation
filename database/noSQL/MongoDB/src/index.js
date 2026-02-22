const express = require('express');
const { connect } = require('./db');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

connect();  // подключение к MongoDB через Mongoose

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));