const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectFlash = require('connect-flash');
const passport = require('./config/passport');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./database/db');

const homeRoute = require('./routes/home');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');
const searchRoute = require('./routes/search');
const authRoute = require('./routes/auth');
const messageRoute = require('./routes/message');

const db_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.cgzxuut.mongodb.net/social_media_app?retryWrites=true&w=majority`;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 60000 * 60 // 60 minutes
    },
    store: MongoStore.create({
        mongoUrl: db_url
    })
}));

app.use(passport.authenticate('session'));
app.use(connectFlash());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'pug');
app.use(express.static('public'));

app.use('/', homeRoute);
app.use('/post', postRoute);
app.use('/user', userRoute);
app.use('/search', searchRoute);
app.use('/auth', authRoute);
app.use('/message', messageRoute);

app.listen(PORT, async () => {
    console.log(`server running on port ${PORT}`);
});

