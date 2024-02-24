const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const { authorize } = require('../config/auth');

router.use(authorize);

router.get('/', async (req, res, next) => {
    try {
        const currUser = await User.findOne({_id: req.user.id});

        const posts = await Post.find()
                        .where('author')
                        .in(currUser.friends)
                        .limit(req.query.postLimit)
                        .skip(req.query.postSkip)
                        .populate('author', 'username profilePicture');
    
        res.render('partials/posts', {
            posts,
            likedPosts: currUser.likedPosts
        })
    }
    catch(err) {
        next(err);
    }
});

router.post('/', async (req, res) => {
    const post = new Post({
        text: req.body.post_content,
        author: req.user.id
    });

    await post.save();

    await User.updateOne({_id: req.user.id}, {
        $push: {posts: post._id}
    });

    res.json({inserted: true});
})

router.delete('/:postID', async (req, res) => {
    const post = await Post.findOne({_id: req.params.postID});

    if(post.author != req.user.id) {
        return res.json({error: 'unauthorized deletion of a post'});
    }

    const postAuthor = await User.findOne({_id: post.author});

    await User.updateOne({_id: postAuthor._id}, {
        $pull: {
            posts: post._id
        }
    });

    await Post.deleteOne({_id: post._id});

    return res.json({deleted: true});
})

router.patch('/comment/like/:commentID', async (req, res) => {
    await Comment.updateOne({_id: req.params.commentID}, {
        $inc: {likes: 1}
    });

    await User.updateOne({_id: req.user.id}, {
        $push: {likedComments: req.params.commentID}
    });

    res.json({updated: true});
});

router.patch('/comment/unlike/:commentID', async (req, res) => {
    await Comment.updateOne({_id: req.params.commentID}, {
        $inc: {likes: -1}
    });

    await User.updateOne({_id: req.user.id}, {
        $pull: {likedComments: req.params.commentID}
    });

    res.json({updated: true});
});

router.patch('/like/:postID', async (req, res) => {
    await Post.updateOne({_id: req.params.postID}, {
        $inc: {likes: 1}
    });

    await User.updateOne({_id: req.user.id}, {
        $push: {likedPosts: req.params.postID}
    });

    res.json({updated: true});
});

router.patch('/unlike/:postID', async (req, res) => {
    await Post.updateOne({_id: req.params.postID}, {
        $inc: {likes: -1}
    });

    await User.updateOne({_id: req.user.id}, {
        $pull: {likedPosts: req.params.postID}
    });

    res.json({updated: true});
});

router.get('/comment/:postID', async (req, res) => {
    const comments = await Comment.find({post: req.params.postID})
                                .populate('author', 'username profilePicture');
    
    const currUser = await User.findOne({_id: req.user.id});

    res.render('partials/get_comments', {
        comments,
        likedComments: currUser.likedComments,
        currUsername: currUser.username
    });
});


router.post('/comment/:postID', async (req, res) => {
    const comment = Comment({
        text: req.body.commentText,
        author: req.user.id,
        post: req.params.postID
    });


    await comment.save();

    await Post.updateOne({_id: req.params.postID}, {
        $push: {comments: comment._id}
    });

    res.json({updated: true})
});

router.delete('/comment/:commentID', async (req, res) => {
    const comment =  await Comment.findOne({_id: req.params.commentID});

    if(comment.author != req.user.id) {
        return res.json({error: 'unauthorized deletion'});
    }

    await Comment.deleteOne({_id: comment._id});
    await Post.updateOne({_id: comment.post}, {
        $pull: {comments: comment._id}
    });

    return res.json({deleted: true});
})

module.exports = router;