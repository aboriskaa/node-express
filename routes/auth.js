const { Router } = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })

})

router.post('/login', async (req, res) => {
    const user = await User.findById('62d18eb8db2c8c39e1cb2230');
    req.session.user = user;
    req.session.isAuthentication = true;
    req.session.save(err => {
        if (err) { throw err }
        res.redirect('/')
    })

})

module.exports = router;