const express = require('express');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

const { authorize, loginAuth } = require('../config/auth');

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage});

router.get('/create-profile', loginAuth, (req, res) => {
    res.render('create-profile');
});

router.post('/create-profile', loginAuth, upload.single('profile_picture'), async (req, res) => {
    const firstname = req.body.firstname.trim().toLowerCase();
    const lastname = req.body.lastname.trim().toLowerCase();
    const bio = req.body.bio.trim();

    if(!req.file) {
        await User.updateOne({_id: req.user.id}, {
            $set: {
                firstname: firstname,
                lastname: lastname,
                bio: bio,
                profilePicture: 'default-profile-picture.png',
                profileCreated: true
            }
        });

        req.user.profileCreated = true;
        return res.redirect('/');
    }

    const imageExtension = req.file.mimetype.split('/')[1];
    const imageName = `${Date.now()}_${req.user.username}.${imageExtension}`;
    const imagePath = `./public/profile_pictures/${imageName}`;

    sharp(req.file.buffer)
        .resize(200, 200, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .toFile(imagePath, async (err, info) => {
            await User.updateOne({_id: req.user.id}, {
                $set: {
                    firstname: firstname,
                    lastname: lastname,
                    bio: bio,
                    profilePicture: imageName,
                    profileCreated: true
                }
            });

            req.user.profileCreated = true;
            res.redirect('/');
        });
});

router.use(authorize);

router.get('/picture/:username', async(req, res) => {
    const user = await User.findOne({username: req.params.username}, 'profilePicture');
    const image = user.profilePicture;

    
    res.sendFile(path.join(__dirname, '../public/profile_pictures/' + image));
});

router.get('/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username});
    const currUser = await User.findOne({_id: req.user.id});

    if(!user) return res.json({error: 'no such user'});

    const posts = await Post.find({author: user._id})
                            .populate('author', 'username profilePicture');
    
    res.render('user-profile', {
        friendList: currUser.friends,
        requestedFriends: currUser.requestedFriends,
        friendRequestsReceived: currUser.friendRequestsReceived,
        likedPosts: currUser.likedPosts,
        currUsername: currUser.username,
        profilePicture: currUser.profilePicture,
        user,
        posts
    });
});

router.patch('/add/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username});

    await User.updateOne({_id: req.user.id}, {
        $push: {
            requestedFriends: user._id
        }
    });

    await User.updateOne({username: req.params.username}, {
        $push: {
            friendRequestsReceived: req.user.id
        }
    })

    res.json({updated: true});
});

router.patch('/remove/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username});

    await User.updateOne({_id: req.user.id}, {
        $pull: {
            friends: user._id
        }
    });

    await User.updateOne({username: req.params.username}, {
        $pull: {
            friends: req.user.id
        }
    })

    res.json({updated: true});
});

router.patch('/cancel-request/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username});

    await User.updateOne({_id: req.user.id}, {
        $pull: {
            requestedFriends: user._id
        }
    });

    await User.updateOne({username: req.params.username}, {
        $pull: {
            friendRequestsReceived: req.user.id
        }
    })

    res.json({updated: true});
});


router.patch('/delete-request/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username});

    await User.updateOne({_id: req.user.id}, {
        $pull: {
            friendRequestsReceived: user._id
        }
    });

    await User.updateOne({username: req.params.username}, {
        $pull: {
            requestedFriends: req.user.id
        }
    })

    res.json({updated: true});
});

router.patch('/accept-request/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username});

    await User.updateOne({_id: req.user.id}, {
        $pull: {
            friendRequestsReceived: user._id
        }
    });

    await User.updateOne({username: req.params.username}, {
        $pull: {
            requestedFriends: req.user.id
        }
    })

    await User.updateOne({_id: req.user.id}, {
        $push: {
            friends: user._id
        }
    });

    await User.updateOne({username: req.params.username}, {
        $push: {
            friends: req.user.id
        }
    })

    res.json({updated: true});
});



module.exports = router;