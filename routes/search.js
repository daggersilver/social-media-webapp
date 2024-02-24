const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();

const User = require('../models/User');

const { authorize } = require('../config/auth');

router.use(authorize);

router.get('/', async (req, res) => {
    const currUser = await User.findOne({_id: req.user.id})
                            .populate('friendRequestsReceived', 'firstname lastname username profilePicture')
                            
    const friendRequests = currUser.friendRequestsReceived;

    const suggestions = await User.aggregate([
        {
            $match: {
                $and: [
                    {_id: {$ne: currUser._id}},
                    {_id: {$nin: currUser.friends}},
                    {_id: {$nin: currUser.requestedFriends}}
                ]
            }
        },
        {
            $sample: {size: 10}
        }
    ]);

    res.render('search', {
        friendRequests,
        suggestions,
        currUserID: req.user.id,
        profilePicture: currUser.profilePicture,
        currUsername: currUser.username
    });
})

router.get('/users', async (req, res) => {
    const userQuery = req.query.userQuery.split(' ');

    const queryList = [];

    for(let query of userQuery) {
        queryList.push({firstname: query});
        queryList.push({lastname: query});
        queryList.push({username: query});
    }

    const users = await User.find({
        $or: queryList
    }).where('_id').ne(req.user.id);

    res.render('partials/search-users', {
        users
    });
});

router.patch('/requests/accept/:userID', async (req, res) => {
    await User.updateOne({_id: req.user.id}, {
        $pull: {
            friendRequestsReceived: req.params.userID
        },
        $push: {
            friends: req.params.userID
        }
    });

    await User.updateOne({_id: req.params.userID}, {
        $pull: {
            requestedFriends: req.user.id
        },
        $push: {
            friends: req.user.id
        }
    });

    res.json({updated: true});
});

router.patch('/requests/cancel/:userID', async (req, res) => {
    await User.updateOne({_id: req.user.id}, {
        $pull: {
            friendRequestsReceived: req.params.userID
        }
    });

    await User.updateOne({_id: req.params.userID}, {
        $pull: {
            requestedFriends: req.user.id
        }
    });

    res.json({updated: true});
});

module.exports = router;