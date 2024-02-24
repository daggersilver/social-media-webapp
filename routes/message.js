const express = require('express');
const router = express.Router();

const Message = require('../models/Message');

const { authorize } = require('../config/auth');

router.use(authorize);

router.get('/:userID', async (req, res) => {
    const messages = await Message.find({
        $or: [
            {
                sender: req.user.id,
                receiver: req.params.userID
            },
            {
                receiver: req.user.id,
                sender: req.params.userID
            }
        ]
    }).skip(req.query.skip);

    res.json(messages);
});

router.post('/:userID', async(req, res) => {
    const newMessage = await Message({
        sender: req.user.id,
        receiver: req.params.userID,
        content: req.body.content
    });

    await newMessage.save();

    res.json({inserted: true});
});

module.exports = router;