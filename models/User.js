const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    profilePicture: String,
    bio: String,

    profileCreated: {
        type: Boolean,
        default: false
    },
    
    username: {
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    requestedFriends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    friendRequestsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],

    likedComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]

});

userSchema.methods.getName = function() {
    const firstname = this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1);
    const lastname = this.lastname.charAt(0).toUpperCase() + this.lastname.slice(1);
    return `${firstname} ${lastname}`;
}

module.exports = mongoose.model('User', userSchema);