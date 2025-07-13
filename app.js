require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const UserRouter = require('./routes/UserRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const { default: mongoose } = require('mongoose');

const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', UserRouter)
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        });
    }).catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });
module.exports = app;