const { Router } = require('express')
const User = require('../models/user')
const router = Router()
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

const keys = require('../keys');

regEmail = require('../emails/registration');
resetEmail = require('../emails/reset');

const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY }
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) { throw err }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Invalid password');
                res.redirect('/auth/login#login')
            }

        } else {
            req.flash('loginError', 'User does not exist');
            res.redirect('/auth/login#login')
        }
    }
    catch (e) {

    }


})


router.post('/register', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            req.flash('registerError', 'User already exist')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: { items: [] }
            })
            await user.save();
            res.redirect('/auth/login#login');
            // e-mail send:

            await transporter.sendMail(regEmail(email))
        }
    }
    catch (e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Have you forgotten your password?',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Some error, try again latter');
                return res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email: req.body.email });

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(candidate.email, token);
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'E-mail does not exist');
                return res.redirect('/auth/reset');
            }
        })
    } catch (e) {
        console.log(e)
    }
})



module.exports = router;