const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    text: String,

    likes: {
        type: Number,
        default: 0
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    createdOn: {
        type: Date,
        default: Date.now
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

});

postSchema.methods.getLikes = function(post) {
    return `(${this.likes})`;
}

postSchema.methods.getCommentCount = function(post) {
    return `(${this.comments.length})`;
}

postSchema.methods.createdOnElapsed = function(post) {
    let timeElapsed = Date.now() - new Date(this.createdOn);

    const years = Math.floor(timeElapsed / (1000*60*60*24*365));
    const weeks = Math.floor(timeElapsed / (1000*60*60*24*7));
    const days = Math.floor(timeElapsed / (1000*60*60*24));
    const hours = Math.floor(timeElapsed / (1000*60*60));
    const minutes = Math.floor(timeElapsed / (1000*60));
    const seconds = Math.floor(timeElapsed / 1000);

    if(years > 0)
        return years + ' y ago';
    else if(weeks > 0)
        return weeks + ' w ago';
    else if(days > 0)
        return days + ' d ago';
    else if(hours > 0)
        return hours + ' h ago';
    else if(minutes > 0)
        return minutes  + ' m ago';
    else 
        return seconds + ' s ago';
}

const Post = mongoose.model('Post', postSchema);

module.exports = Post;