require('dotenv').config();
const path = require('path');

const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// For express rate limiter:
app.set('trust proxy', 1);

// Routes
const userRouter = require('./routes/user');
const surveyRouter = require('./routes/submit');
const authRouter = require('./routes/auth');

app.use('/api/user', userRouter);
app.use('/api/submit', surveyRouter);
app.use('/api/auth', authRouter);

// process.env.LOCAL_URI
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => {
    console.log('Connected to MongoDB Shell');
})
.catch(() => {
    console.log('eRROR: could not connect to mongoDB');
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( path.join(__dirname, 'front-end', 'build') ));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Yoo we live on port ${port}`);
});