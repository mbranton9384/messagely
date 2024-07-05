const express = require('express');
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const User = require('../models/user');
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.params;
        const message = await Message.get(id);
        return res.json({message});
    }catch(e) {
        return next(e);
    }
});

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const {to_username, body} = req.body;
        const from_username = req.user.username;

        const message = await Message.create({from_username, to_username, body});

        return res.status(201).json({message});
    }catch(e) {
        return next(e)
    }
});

router.post('/:id/read', async (req,res, next) => {
    try {
        const {id} = req.params;
        const message = await Message.get(id);

        const updatedMessage = await Message.markAsRead(id);
        return res.json({message: updatedMessage});
    }catch(e) {
        return next(e);
    }
});


