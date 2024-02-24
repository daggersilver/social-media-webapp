const express = require('express');
const path = require('path');
const router = express.Router();

const { authorize } = require('../config/auth.js')

const User = require('../models/User');
const Post = require('../models/Post');

router.get('/', authorize, async (req, res) => {
    const currUser = await User.findOne({_id: req.user.id})
                        .populate('friends', 'firstname lastname username profilePicture');

    const friends = currUser.friends;

    const POST_LIMIT = 5;
    let skip = 0;

    const posts = await Post.find()
                    .where('author')
                    .in(friends)
                    .limit(POST_LIMIT)
                    .skip(skip)
                    .populate('author', 'username profilePicture');
    
    skip += POST_LIMIT;

    res.render('index', {
        friendlist: currUser.friends,
        posts,
        likedPosts: currUser.likedPosts,
        currUsername: currUser.username,
        profilePicture: currUser.profilePicture
    });
});

module.exports = router;