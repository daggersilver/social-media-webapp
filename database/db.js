const mongoose = require('mongoose');

require('dotenv').config();

const db_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.cgzxuut.mongodb.net/social_media_app?retryWrites=true&w=majority`;

mongoose.connect(db_url);

mongoose.connection.on('connected', () => {
    console.log('database connected');
})


