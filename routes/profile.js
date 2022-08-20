const { Router } = require('express');
const auth = require('../midleware/auth');
const User = require('../models/user');
const router = Router();

router.get('/', async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const toChange = {
            name: req.body.name
        }
        if (req.file) {
            toChange.avatarUrl = req.file.path;
        }
        console.log(req.file);
        Object.assign(user, toChange)
        await user.save();
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})
module.exports = router;