require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');

const userRouter = require('./routes/user');
const surveyRouter = require('./routes/survey');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/surveys', surveyRouter);
app.use('/api/auth', authRouter);

mongoose.connect(process.env.LOCAL_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB Shell');
})
.catch(() => {
    console.log('eRROR: could not connect to mongoDB');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Yoo we live on port ${port}`);
});